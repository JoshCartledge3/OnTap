using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnTap.Api.Entities;

namespace OnTap.Api.Data.Configurations;

public class PubConfiguration : IEntityTypeConfiguration<PubEntity>
{
    public void Configure(EntityTypeBuilder<PubEntity> builder)
    {
        builder.ToTable("Pubs");
        builder.HasKey(pub => pub.Id);

        builder.Property(pub => pub.OsmType).HasConversion<string>().HasMaxLength(8);
        builder.HasIndex(pub => new { pub.OsmType, pub.OsmId }).IsUnique();
        builder.Property(pub => pub.WheelchairAccess).HasConversion<string>().HasMaxLength(10);
        builder.Property(pub => pub.PaymentMethodsAccepted).HasConversion<string>().HasMaxLength(10);
        builder.PrimitiveCollection(pub => pub.SportsBroadcasters)
            .ElementType().HasConversion<string>();

        builder.Property(pub => pub.Name).HasMaxLength(200).IsRequired();
        builder.Property(pub => pub.Address).HasMaxLength(500);
        builder.Property(pub => pub.Postcode).HasMaxLength(20);
        builder.Property(pub => pub.Location)
            .HasColumnType("geography (point, 4326)")
            .IsRequired();
        builder.Property(pub => pub.Status)
            .HasConversion<string>()
            .HasMaxLength(30)
            .IsRequired();
        builder.Property(pub => pub.CreatedAt).IsRequired();

        builder.HasIndex(pub => pub.Location).HasMethod("gist");
    }
}
