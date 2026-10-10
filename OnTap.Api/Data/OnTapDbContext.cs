using Microsoft.EntityFrameworkCore;
using OnTap.Api.Entities;

namespace OnTap.Api.Data;

public class OnTapDbContext(DbContextOptions<OnTapDbContext> options) : DbContext(options)
{
    public DbSet<PubEntity> Pubs => Set<PubEntity>();
    public DbSet<DrinkEntity> Drinks => Set<DrinkEntity>();
    public DbSet<PubDrinkEntity> PubDrinks => Set<PubDrinkEntity>();
    public DbSet<DrinkRatingEntity> DrinkRatings => Set<DrinkRatingEntity>();
    public DbSet<PubRatingEntity> PubRatings => Set<PubRatingEntity>();
    public DbSet<UserEntity> Users => Set<UserEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasPostgresExtension("postgis");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(OnTapDbContext).Assembly);
    }
}
