using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnTap.Api.Entities;

namespace OnTap.Api.Data.Configurations;

public class PubDrinkConfiguration
    : IEntityTypeConfiguration<PubDrinkEntity>
{
    public void Configure(EntityTypeBuilder<PubDrinkEntity> builder)
    {
        builder.ToTable("PubDrinks");

        builder.Property(pubDrink => pubDrink.ServingType)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasOne<PubEntity>()
            .WithMany()
            .HasForeignKey(pubDrink => pubDrink.PubId);

        builder.HasOne<DrinkEntity>()
            .WithMany()
            .HasForeignKey(pubDrink => pubDrink.DrinkId);

        builder.HasIndex(pubDrink => new
        {
            pubDrink.PubId,
            pubDrink.DrinkId,
            pubDrink.ServingType
        }).IsUnique();
    }
}