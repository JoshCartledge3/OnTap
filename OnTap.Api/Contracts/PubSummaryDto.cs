namespace OnTap.Api.Contracts;

public sealed record PubSummaryDto(
    Guid Id,
    string Name,
    string Address,
    double Latitude,
    double Longitude,
    bool? IsOpenNow);
