using OnTap.Api.Contracts;

namespace OnTap.Api.Services.Abstraction;

public interface IOverpassService
{
    Task ImportPubsAsync(CancellationToken ct = default);
}
