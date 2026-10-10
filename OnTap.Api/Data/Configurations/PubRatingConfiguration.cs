using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnTap.Api.Entities;

namespace OnTap.Api.Data.Configurations;

public class PubRatingConfiguration
    : IEntityTypeConfiguration<PubRatingEntity>
{
    public void Configure(EntityTypeBuilder<PubRatingEntity> builder)
    {
        builder.ToTable("PubRatings", table =>
            table.HasCheckConstraint(
                "CK_PubRatings_Rating",
                "\"Rating\" BETWEEN 1 AND 5"));

        builder.HasIndex(rating => new
        {
            rating.UserId,
            rating.PubId
        }).IsUnique();

        builder.HasOne<PubEntity>()
            .WithMany()
            .HasForeignKey(rating => rating.PubId);

        builder.HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(rating => rating.UserId);
    }
}
