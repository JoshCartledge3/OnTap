using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnTap.Api.Contracts;
using OnTap.Api.Services.Abstraction;

namespace OnTap.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/users")]
[Tags("Users")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost("me", Name = "GetOrCreateCurrentUser")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserDto>> GetOrCreateCurrentUser(CancellationToken ct = default)
    {
        var authSubject = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(authSubject))
            return Unauthorized();

        var accessToken = await HttpContext.GetTokenAsync("access_token");
        if (string.IsNullOrWhiteSpace(accessToken))
            return Unauthorized();

        var user = await userService.GetOrCreateUserAsync(authSubject, accessToken, ct);
        return Ok(user);
    }
}
