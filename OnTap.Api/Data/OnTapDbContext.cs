using Microsoft.EntityFrameworkCore;
using OnTap.Api.Models;

namespace OnTap.Api.Data;

public class OnTapDbContext(DbContextOptions<OnTapDbContext> options) : DbContext(options)
{
    public DbSet<Pub> Pubs => Set<Pub>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasPostgresExtension("postgis");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(OnTapDbContext).Assembly);
    }
}
