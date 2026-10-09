using NetTopologySuite.Geometries;

namespace OnTap.Api.Entities;

public class PubEntity
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public OsmType? OsmType { get; set; }
    public long? OsmId { get; set; }
    public required string Name { get; set; }
    public string? Address { get; set; }
    public string? Postcode { get; set; }
    public string? Place { get; set; }
    public string? Village { get; set; }
    public string? Town { get; set; }
    public string? City { get; set; }
    public string? Phone { get; set; }
    public string? OpeningHours { get; set; }
    public bool? DogsAllowed { get; set; }
    public bool? OutdoorSeating { get; set; }
    public bool? ServesFood { get; set; }
    public WheelchairAccess? WheelchairAccess { get; set; }
    public SportsBroadcaster[]? SportsBroadcasters { get; set; }
    public PaymentMethodAcceptance? PaymentMethodsAccepted { get; set; }

    // WGS84 (SRID 4326): X is longitude, Y is latitude.
    public required Point Location { get; set; }

    public PubStatus Status { get; set; } = PubStatus.Open;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
