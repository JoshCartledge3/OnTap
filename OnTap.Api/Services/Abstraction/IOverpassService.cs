using OnTap.Api.Contracts;

namespace OnTap.Api.Services.Abstraction;

public interface IOverpassService
{
    Task<OverpassResponse> GetUkPubsAndBarsAsync(CancellationToken ct = default);
}
