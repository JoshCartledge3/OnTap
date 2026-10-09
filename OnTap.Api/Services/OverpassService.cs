using System.Text.Json;
using OnTap.Api.Contracts;
using OnTap.Api.Entities;
using OnTap.Api.Mappers;
using OnTap.Api.Services.Abstraction;

namespace OnTap.Api.Services;

public class OverpassService(HttpClient httpClient, IHostEnvironment environment, ILogger<OverpassService> logger, IPubService pubService) : IOverpassService
{
    private static readonly string[] RequiredTags = ["name"];

    private const string UkPubsQuery = """
        [out:json][timeout:180];
        area["ISO3166-1"="GB"]["admin_level"="2"]->.uk;
        nwr["amenity"="pub"](area.uk);
        out body center;
        """;

    private async Task<OverpassResponse> GetUkPubsAsync(CancellationToken ct = default)
    {
        var isDevelopment = environment.IsDevelopment();
        const string scope = "UK";
        var source = isDevelopment ? "local JSON" : "Overpass";

        logger.LogInformation("Loading pubs for {Scope} from {Source}", scope, source);

        try
        {
            OverpassResponse? result;
            if (isDevelopment)
            {
                await using var stream = File.OpenRead(Path.Combine(environment.ContentRootPath, "Data", "Development", "osm-uk.json"));
                result = await JsonSerializer.DeserializeAsync<OverpassResponse>(stream, JsonSerializerOptions.Web, ct);
            }
            else
            {
                using var request = new HttpRequestMessage(HttpMethod.Post, "interpreter");
                request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["data"] = UkPubsQuery
                });

                using var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
                response.EnsureSuccessStatusCode();

                await using var stream = await response.Content.ReadAsStreamAsync(ct);
                result = await JsonSerializer.DeserializeAsync<OverpassResponse>(stream, JsonSerializerOptions.Web, ct);
            }

            if (result is null)
                throw new JsonException("Overpass returned a null response.");

            // Check for Overpass query failure
            if (!string.IsNullOrWhiteSpace(result.Remark))
            {
                throw new InvalidOperationException($"Overpass query failed: {result.Remark}");
            }

            logger.LogInformation("Loaded {ElementCount} pubs for {Scope} from {Source}", result.Elements.Count, scope, source);
            return result;
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            logger.LogInformation("Loading pubs cancelled for {Scope} from {Source}", scope, source);
            throw;
        }
        catch (Exception exception)
        {
            var level = exception is HttpRequestException { StatusCode: { } statusCode }
                && (int)statusCode is >= 400 and < 500
                ? LogLevel.Warning
                : LogLevel.Error;

            logger.Log(level, exception, "Failed to load pubs for {Scope} from {Source}", scope, source);
            throw;
        }
    }

    public async Task ImportPubsAsync(CancellationToken ct = default)
    {
        var overpassResult = await GetUkPubsAsync(ct);
        List<PubEntity> mappedEntities = [];
        foreach (var element in overpassResult.Elements)
        {
            if (!ValidateOverpassElement(element))
            {
                continue;
            }
            mappedEntities.Add(element.ToEntity());
        }

        await pubService.AddOrUpdatePubsAsync(mappedEntities, ct);
    }

    private static bool ValidateOverpassElement(OverpassElement element)
    {
        if (!element.Tags.TryGetValue("amenity", out var amenity) || amenity != "pub")
            return false;

        if (!RequiredTags.All(tag => element.Tags.TryGetValue(tag, out var value)
                && !string.IsNullOrWhiteSpace(value)))
        {
            return false;
        }

        var latitude = element.Latitude ?? element.Center?.Latitude;
        var longitude = element.Longitude ?? element.Center?.Longitude;

        return latitude.HasValue && longitude.HasValue
            && double.IsFinite(latitude.Value) && double.IsFinite(longitude.Value)
            && latitude.Value is >= -90 and <= 90
            && longitude.Value is >= -180 and <= 180;
    }
}
