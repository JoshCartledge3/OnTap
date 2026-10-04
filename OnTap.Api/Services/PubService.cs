using Microsoft.EntityFrameworkCore;
using OnTap.Api.Contracts;
using OnTap.Api.Contracts.Requests;
using OnTap.Api.Data;
using OnTap.Api.Mappers;
using OnTap.Api.Services.Abstraction;
using NetTopologySuite.Geometries;


namespace OnTap.Api.Services;

public class PubService(OnTapDbContext dbContext) : IPubService
{
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
}
