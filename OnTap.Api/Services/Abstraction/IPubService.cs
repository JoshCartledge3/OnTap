using OnTap.Api.Contracts;
using OnTap.Api.Contracts.Requests;

namespace OnTap.Api.Services.Abstraction;

public interface IPubService
{
    Task<IEnumerable<PubDto>> GetPubsAsync(CancellationToken ct = default);
    Task<IEnumerable<PubDto>> GetPubsInRangeAsync(GetPubsInRangeRequest request, CancellationToken ct = default);
}
