using OnTap.Api.Contracts;

namespace OnTap.Api.Services.Abstraction;

public interface IPubService
{
    Task<IEnumerable<PubDto>> GetPubsAsync(CancellationToken ct = default);
}
