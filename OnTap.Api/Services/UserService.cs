using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using Npgsql;
using OnTap.Api.Contracts;
using OnTap.Api.Data;
using OnTap.Api.Entities;
using OnTap.Api.Mappers;
using OnTap.Api.Services.Abstraction;

namespace OnTap.Api.Services;

public class UserService(OnTapDbContext dbContext, HttpClient httpClient) : IUserService
{
    public async Task<UserDto> GetOrCreateUserAsync(string authSubject, string accessToken, CancellationToken ct = default)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(user => user.AuthSubject == authSubject, ct);

        if (user is not null && !string.IsNullOrWhiteSpace(user.DisplayName))
            return UserMapper.ToDto(user);

        var displayName = await GetDisplayNameAsync(authSubject, accessToken, ct);
        if (user is not null)
        {
            user.DisplayName = displayName;
            await dbContext.SaveChangesAsync(ct);
            return UserMapper.ToDto(user);
        }

        user = new UserEntity { AuthSubject = authSubject, DisplayName = displayName };
        dbContext.Users.Add(user);

        try
        {
            await dbContext.SaveChangesAsync(ct);
        }
        catch (DbUpdateException exception) when (
            exception.InnerException is PostgresException
            {
                SqlState: PostgresErrorCodes.UniqueViolation,
                ConstraintName: "IX_Users_AuthSubject"
            })
        {
            // Another request created this user first.
            dbContext.Entry(user).State = EntityState.Detached;

            user = await dbContext.Users.AsNoTracking().SingleAsync(userEntity => userEntity.AuthSubject == authSubject, ct);
        }

        return UserMapper.ToDto(user);
    }

    private async Task<string?> GetDisplayNameAsync(string authSubject, string accessToken, CancellationToken ct)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "userinfo");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        using var response = await httpClient.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var profile = await response.Content.ReadFromJsonAsync<Auth0Profile>(ct);
        if (profile is null || !string.Equals(profile.Subject, authSubject, StringComparison.Ordinal))
            throw new InvalidOperationException("Auth0 profile does not match the authenticated user.");

        var displayName = new[] { profile.GivenName, profile.Name, profile.Nickname }
            .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value))?.Trim();
        if (string.IsNullOrWhiteSpace(displayName))
            return null;

        return displayName.Length > 200 ? displayName[..200] : displayName;
    }

    private sealed record Auth0Profile(
        [property: JsonPropertyName("sub")] string Subject,
        [property: JsonPropertyName("given_name")] string? GivenName,
        [property: JsonPropertyName("name")] string? Name,
        [property: JsonPropertyName("nickname")] string? Nickname);
}
