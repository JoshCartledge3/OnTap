namespace OnTap.Api.Entities;

public class DrinkEntity
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required string Name { get; set; }
    public required string Category { get; set; }
    public decimal? Abv { get; set; }
}