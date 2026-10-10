using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnTap.Api.Entities;

namespace OnTap.Api.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.ToTable("Users");

        builder.Property(user => user.AuthSubject)
            .HasMaxLength(255)
            .IsRequired();

        builder.HasIndex(user => user.AuthSubject)
            .IsUnique();

        builder.Property(user => user.DisplayName)
            .HasMaxLength(200);
    }
}