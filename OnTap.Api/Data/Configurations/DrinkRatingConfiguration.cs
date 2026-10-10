using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnTap.Api.Entities;

namespace OnTap.Api.Data.Configurations;

public class DrinkRatingConfiguration
    : IEntityTypeConfiguration<DrinkRatingEntity>
{
    public void Configure(EntityTypeBuilder<DrinkRatingEntity> builder)
    {
        builder.ToTable("DrinkRatings", table =>
            table.HasCheckConstraint(
                "CK_DrinkRatings_Rating",
                "\"Rating\" BETWEEN 1 AND 5"));

        builder.HasIndex(rating => new
        {
            rating.UserId,
            rating.PubDrinkId
        }).IsUnique();

        builder.HasOne<PubDrinkEntity>()
            .WithMany()
            .HasForeignKey(rating => rating.PubDrinkId);
    }
}