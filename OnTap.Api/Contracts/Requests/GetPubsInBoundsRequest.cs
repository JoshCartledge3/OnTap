using System.ComponentModel.DataAnnotations;

namespace OnTap.Api.Contracts.Requests;

public sealed record GetPubsInBoundsRequest : IValidatableObject
{
    [Required]
    [Range(-180d, 180d)]
    public required double? West { get; init; }

    [Required]
    [Range(-90d, 90d)]
    public required double? South { get; init; }

    [Required]
    [Range(-180d, 180d)]
    public required double? East { get; init; }

    [Required]
    [Range(-90d, 90d)]
    public required double? North { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (West.HasValue && East.HasValue && West.Value >= East.Value)
        {
            yield return new ValidationResult(
                "West must be less than East.", [nameof(West), nameof(East)]);
        }

        if (South.HasValue && North.HasValue && South.Value >= North.Value)
        {
            yield return new ValidationResult(
                "South must be less than North.", [nameof(South), nameof(North)]);
        }
    }
}
