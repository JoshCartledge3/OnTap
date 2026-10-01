namespace OnTap.Api.Contracts;

public sealed record PubDto(
    Guid Id,
    string Name,
    string Address,
    string? Postcode,
    double Latitude,
    double Longitude,
    string Status,
    DateTimeOffset CreatedAt);
