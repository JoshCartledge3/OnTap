using Microsoft.EntityFrameworkCore;
using OnTap.Api.Contracts;
using OnTap.Api.Contracts.Requests;
using OnTap.Api.Data;
using OnTap.Api.Entities;
using OnTap.Api.Mappers;
using OnTap.Api.Services.Abstraction;
using NetTopologySuite.Geometries;


namespace OnTap.Api.Services;

public class PubService(OnTapDbContext dbContext, ILogger<PubService> logger) : IPubService
{
    public async Task AddOrUpdatePubsAsync(IEnumerable<PubEntity> pubs, CancellationToken ct = default)
    {
        try
        {
            var pubsToSave = pubs.ToArray();
            if (pubsToSave.Length == 0)
            {
                logger.LogInformation("Pub import saved: {AddedCount} added, {UpdatedCount} updated", 0, 0);
                return;
            }

            if (pubsToSave.Any(pub => pub.OsmType is null || pub.OsmId is null))
            {
                throw new ArgumentException("An OSM type and ID are required to add or update imported pubs.", nameof(pubs));
            }

            var osmIds = pubsToSave.Select(pub => pub.OsmId).Distinct().ToArray();
            var existingPubs = await dbContext.Pubs
                .Where(existing => existing.OsmType != null && osmIds.Contains(existing.OsmId))
                .ToDictionaryAsync(existing => (existing.OsmType, existing.OsmId), ct);
            List<PubEntity> newPubs = [];
            HashSet<PubEntity> updatedPubs = [];

            foreach (var pub in pubsToSave)
            {
                var key = (pub.OsmType, pub.OsmId);
                if (!existingPubs.TryGetValue(key, out var existingPub))
                {
                    newPubs.Add(pub);
                    existingPubs.Add(key, pub);
                    continue;
                }

                existingPub.Name = pub.Name;
                existingPub.Address = pub.Address;
                existingPub.Postcode = pub.Postcode;
                existingPub.Phone = pub.Phone;
                existingPub.OpeningHours = pub.OpeningHours;
                existingPub.DogsAllowed = pub.DogsAllowed;
                existingPub.OutdoorSeating = pub.OutdoorSeating;
                existingPub.ServesFood = pub.ServesFood;
                existingPub.WheelchairAccess = pub.WheelchairAccess;
                existingPub.SportsBroadcasters = pub.SportsBroadcasters;
                existingPub.PaymentMethodsAccepted = pub.PaymentMethodsAccepted;
                existingPub.Location = pub.Location;
                existingPub.VenueType = pub.VenueType;
                updatedPubs.Add(existingPub);
            }

            dbContext.Pubs.AddRange(newPubs);
            var updatedCount = updatedPubs.Count(pub => dbContext.Entry(pub).State == EntityState.Modified);
            await dbContext.SaveChangesAsync(ct);

            logger.LogInformation("Pub import saved: {AddedCount} added, {UpdatedCount} updated", newPubs.Count, updatedCount);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            logger.LogInformation("Adding or updating pubs cancelled");
            throw;
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Failed to add or update pubs");
            throw;
        }
    }

    public async Task<IEnumerable<PubDto>> GetPubsAsync(CancellationToken ct = default)
    {
        var pubs = await dbContext.Pubs
            .AsNoTracking()
            .OrderBy(pub => pub.Name)
            .ThenBy(pub => pub.Id)
            .ToListAsync(ct);

        // Map coordinates after loading: Location is stored as PostGIS geography.
        return pubs.Select(PubMapper.ToDto).ToArray();
    }

    public async Task<IEnumerable<PubDto>> GetPubsInRangeAsync(GetPubsInRangeRequest request, CancellationToken ct = default)
    {
        // Get user's location
        var location = new Point(request.Longitude!.Value, request.Latitude!.Value)
        {
            SRID = 4326
        };

        var pubs = await dbContext.Pubs
            .AsNoTracking()
            .Where(pub => pub.Location.IsWithinDistance(location, request.RadiusMetres!.Value))
            .OrderBy(pub => pub.Location.Distance(location))
            .ThenBy(pub => pub.Id)
            .ToListAsync(ct);

        return pubs.Select(PubMapper.ToDto).ToArray();
    }

    public async Task<IEnumerable<PubDto>> GetPubsInBoundsAsync(GetPubsInBoundsRequest request, CancellationToken ct = default)
    {
        var west = request.West!.Value;
        var south = request.South!.Value;
        var east = request.East!.Value;
        var north = request.North!.Value;
        var bounds = new Polygon(new LinearRing([
            new Coordinate(west, south),
            new Coordinate(east, south),
            new Coordinate(east, north),
            new Coordinate(west, north),
            new Coordinate(west, south)
        ]))
        {
            SRID = 4326
        };

        var pubs = await dbContext.Pubs
            .AsNoTracking()
            .Where(pub => pub.Location.Intersects(bounds))
            .OrderBy(pub => pub.Name)
            .ThenBy(pub => pub.Id)
            .ToListAsync(ct);

        return pubs.Select(PubMapper.ToDto).ToArray();
    }
}
