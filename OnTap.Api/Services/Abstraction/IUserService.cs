using OnTap.Api.Contracts;

namespace OnTap.Api.Services.Abstraction;

public interface IUserService
{
    Task<UserDto> GetOrCreateUserAsync(string authSubject, string accessToken, CancellationToken ct = default);
}
