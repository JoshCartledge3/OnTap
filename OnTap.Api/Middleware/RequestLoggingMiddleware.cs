using System.Diagnostics;

namespace OnTap.Api.Middleware;

public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var startedAt = Stopwatch.GetTimestamp();
        var requestId = context.TraceIdentifier;
        var method = context.Request.Method;
        var path = context.Request.Path;

        logger.LogInformation("Request {RequestId} received: {Method} {Path}", requestId, method, path);

        try
        {
            await next(context);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            logger.LogInformation(
                "Request {RequestId} cancelled: {Method} {Path} after {ElapsedMs} ms",
                requestId, method, path, Stopwatch.GetElapsedTime(startedAt).TotalMilliseconds);
            throw;
        }
        catch (Exception exception)
        {
            logger.LogError(exception,
                "Request {RequestId} failed: {Method} {Path} after {ElapsedMs} ms",
                requestId, method, path, Stopwatch.GetElapsedTime(startedAt).TotalMilliseconds);
            throw;
        }

        var statusCode = context.Response.StatusCode;
        var elapsedMs = Stopwatch.GetElapsedTime(startedAt).TotalMilliseconds;

        if (context.RequestAborted.IsCancellationRequested)
        {
            logger.LogInformation(
                "Request {RequestId} cancelled: {Method} {Path} after {ElapsedMs} ms",
                requestId, method, path, elapsedMs);
        }
        else if (statusCode >= StatusCodes.Status400BadRequest)
        {
            var level = statusCode >= StatusCodes.Status500InternalServerError
                ? LogLevel.Error
                : LogLevel.Warning;

            logger.Log(level,
                "Request {RequestId} failed: {Method} {Path} returned {StatusCode} in {ElapsedMs} ms",
                requestId, method, path, statusCode, elapsedMs);
        }
        else
        {
            logger.LogInformation(
                "Request {RequestId} completed: {Method} {Path} returned {StatusCode} in {ElapsedMs} ms",
                requestId, method, path, statusCode, elapsedMs);
        }
    }
}
