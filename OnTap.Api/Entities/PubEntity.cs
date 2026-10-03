using NetTopologySuite.Geometries;

namespace OnTap.Api.Entities;

public class PubEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Address { get; set; }
    public string? Postcode { get; set; }

    // WGS84 (SRID 4326): X is longitude, Y is latitude.
    public required Point Location { get; set; }

    public PubStatus Status { get; set; } = PubStatus.Open;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
