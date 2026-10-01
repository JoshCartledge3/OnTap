using Microsoft.EntityFrameworkCore;
using OnTap.Api.Contracts;
using OnTap.Api.Data;
using OnTap.Api.Mappers;
using OnTap.Api.Services.Abstraction;

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
}
