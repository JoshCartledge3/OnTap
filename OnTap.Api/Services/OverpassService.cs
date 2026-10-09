using System.Text.Json;
using OnTap.Api.Contracts;
using OnTap.Api.Services.Abstraction;

namespace OnTap.Api.Services;

public class OverpassService(HttpClient httpClient, IHostEnvironment environment, ILogger<OverpassService> logger) : IOverpassService
{
    private const string UkPubsAndBarsQuery = """
        [out:json][timeout:180];
        area["ISO3166-1"="GB"]["admin_level"="2"]->.uk;
        nwr["amenity"~"^(pub|bar)$"](area.uk);
        out body center;
        """;

    private const string WakefieldPubsAndBarsQuery = """
        [out:json][timeout:60];
        area["ISO3166-1"="GB"]["admin_level"="2"]->.uk;
        rel(area.uk)["boundary"="administrative"]["name"="Wakefield"];
        map_to_area->.wakefield;
        nwr["amenity"~"^(pub|bar)$"](area.wakefield);
        out body center;
        """;

    public async Task<OverpassResponse> GetUkPubsAndBarsAsync(CancellationToken ct = default)
    {
        var query = environment.IsDevelopment() ? WakefieldPubsAndBarsQuery : UkPubsAndBarsQuery;
        var scope = environment.IsDevelopment() ? "Wakefield" : "UK";

        logger.LogInformation("Fetching pubs and bars from Overpass for {Scope}", scope);

        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "interpreter");
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["data"] = query
            });

            using var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
            response.EnsureSuccessStatusCode();

            await using var stream = await response.Content.ReadAsStreamAsync(ct);
            var result = await JsonSerializer.DeserializeAsync<OverpassResponse>(stream, JsonSerializerOptions.Web, ct)
                ?? throw new JsonException("Overpass returned a null response.");

            // Check for Overpass query failure
            if (!string.IsNullOrWhiteSpace(result.Remark))
            {
                throw new InvalidOperationException($"Overpass query failed: {result.Remark}");
            }

            logger.LogInformation("Overpass returned {ElementCount} pubs and bars for {Scope}", result.Elements.Count, scope);
            return result;
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            logger.LogInformation("Overpass fetch cancelled for {Scope}", scope);
            throw;
        }
        catch (Exception exception)
        {
            var level = exception is HttpRequestException { StatusCode: { } statusCode }
                && (int)statusCode is >= 400 and < 500
                ? LogLevel.Warning
                : LogLevel.Error;

            logger.Log(level, exception, "Failed to fetch pubs and bars from Overpass for {Scope}", scope);
            throw;
        }
    }
    
}
