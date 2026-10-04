using System.ComponentModel.DataAnnotations;

namespace OnTap.Api.Contracts.Requests;

public sealed record GetPubsInRangeRequest
{
    [Required]
    [Range(-90d, 90d)]
    public required double? Latitude { get; init; }
    
    [Required]
    [Range(-180d, 180d)]
    public required double? Longitude { get; init; }

    [Required]
    [Range(0d, double.MaxValue, MinimumIsExclusive = true)]
    public double? RadiusMetres { get; init; }
}