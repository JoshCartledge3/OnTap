using OnTap.Api.Contracts;
using OnTap.Api.Contracts.Requests;
using OnTap.Api.Entities;

namespace OnTap.Api.Services.Abstraction;

public interface IPubService
{
    Task AddOrUpdatePubsAsync(IEnumerable<PubEntity> pubs, CancellationToken ct = default);
    Task<IEnumerable<PubSummaryDto>> GetPubsAsync(CancellationToken ct = default);
    Task<IEnumerable<PubSummaryDto>> GetPubsInRangeAsync(GetPubsInRangeRequest request, CancellationToken ct = default);
    Task<IEnumerable<PubSummaryDto>> GetPubsInBoundsAsync(GetPubsInBoundsRequest request, CancellationToken ct = default);
}
