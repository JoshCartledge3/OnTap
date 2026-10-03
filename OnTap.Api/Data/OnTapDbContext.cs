using Microsoft.EntityFrameworkCore;
using OnTap.Api.Entities;

namespace OnTap.Api.Data;

public class OnTapDbContext(DbContextOptions<OnTapDbContext> options) : DbContext(options)
{
    public DbSet<PubEntity> Pubs => Set<PubEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasPostgresExtension("postgis");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(OnTapDbContext).Assembly);
    }
}
