using System.Text.Json.Serialization;

namespace OnTap.Api.Contracts;

public sealed record OverpassResponse
{
    public required List<OverpassElement> Elements { get; init; }
    public string? Remark { get; init; }
}

public sealed record OverpassElement
{
    public required string Type { get; init; }
    public required long Id { get; init; }

    [JsonPropertyName("lat")]
    public double? Latitude { get; init; }

    [JsonPropertyName("lon")]
    public double? Longitude { get; init; }

    public OverpassCenter? Center { get; init; }
    public Dictionary<string, string> Tags { get; init; } = [];
}

public sealed record OverpassCenter
{
    [JsonPropertyName("lat")]
    public required double Latitude { get; init; }

    [JsonPropertyName("lon")]
    public required double Longitude { get; init; }
}
