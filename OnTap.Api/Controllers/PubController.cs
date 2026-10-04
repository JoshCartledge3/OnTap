using Microsoft.AspNetCore.Mvc;
using OnTap.Api.Contracts;
using OnTap.Api.Contracts.Requests;
using OnTap.Api.Services.Abstraction;

namespace OnTap.Api.Controllers;

[ApiController]
[Route("api/pubs")]
[Tags("Pubs")]
public class PubController(IPubService pubService) : ControllerBase
{
    [HttpGet("Pubs", Name = "GetPubs")]
    [ProducesResponseType(typeof(IEnumerable<PubDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PubDto>>> GetPubs(CancellationToken ct)
    {
        var pubs = await pubService.GetPubsAsync(ct);
        return Ok(pubs);
    }
    
    [HttpGet("PubsInRange", Name = "GetPubsInRange")]
    [ProducesResponseType(typeof(IEnumerable<PubDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PubDto>>> GetPubsInRange([FromQuery]GetPubsInRangeRequest request, CancellationToken ct)
    {
        var pubs = await pubService.GetPubsInRangeAsync(request, ct);
        return Ok(pubs);
    }
}