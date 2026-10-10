using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnTap.Api.Entities;

namespace OnTap.Api.Data.Configurations;

public class DrinkConfiguration : IEntityTypeConfiguration<DrinkEntity>
{
    public void Configure(EntityTypeBuilder<DrinkEntity> builder)
    {
        builder.ToTable("Drinks");
        builder.HasKey(drink => drink.Id);

        builder.Property(drink => drink.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(drink => drink.Category)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(drink => drink.Abv)
            .HasPrecision(5, 2);
    }
}