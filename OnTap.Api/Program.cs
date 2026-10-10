using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using OnTap.Api.Data;
using OnTap.Api.Middleware;
using OnTap.Api.Services;
using OnTap.Api.Services.Abstraction;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi(options =>
{
    options.OpenApiVersion =
        Microsoft.OpenApi.OpenApiSpecVersion.OpenApi3_0;
});

builder.Services.AddScoped<IPubService, PubService>();
builder.Services.AddHttpClient<IUserService, UserService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Auth0:Authority"]
        ?? throw new InvalidOperationException("Missing configuration value for 'Auth0:Authority'."));
});
builder.Services.AddHttpClient<IOverpassService, OverpassService>(client =>
{
    client.DefaultRequestHeaders.UserAgent.ParseAdd("OnTap/1.0");
    client.BaseAddress = new Uri(builder.Configuration["Overpass:BaseUrl"]
        ?? throw new InvalidOperationException("Missing configuration value for 'Overpass:BaseUrl'."));
    client.Timeout = TimeSpan.FromMinutes(4);
});

builder.Services.AddDbContext<OnTapDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("OnTap") ?? throw new InvalidOperationException("Missing connection string for 'OnTap'."),
        npgsqlOptions => npgsqlOptions.UseNetTopologySuite());
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalWeb", policy =>
        policy.WithOrigins("http://localhost:8081")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Auth0:Authority"];
        options.Audience = builder.Configuration["Auth0:Audience"];
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (args.Contains("--import-pubs"))
{
    using var scope = app.Services.CreateScope();
    var overpassService = scope.ServiceProvider.GetRequiredService<IOverpassService>();
    await overpassService.ImportPubsAsync();
    return;
}

app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/openapi/v1.json", "OnTap API"));
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

if (app.Environment.IsDevelopment())
{
    app.UseCors("LocalWeb");
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
