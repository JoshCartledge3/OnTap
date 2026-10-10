namespace OnTap.Api.Entities;

public class PubDrinkEntity
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid PubId { get; set; }
    public Guid DrinkId { get; set; }
    public DrinkServingType ServingType { get; set; }
}