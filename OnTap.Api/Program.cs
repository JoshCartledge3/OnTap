using Microsoft.EntityFrameworkCore;
using OnTap.Api.Data;
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

builder.Services.AddDbContext<OnTapDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("OnTap") ?? throw new InvalidOperationException("Missing connection string for 'OnTap'."),
        npgsqlOptions => npgsqlOptions.UseNetTopologySuite());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/openapi/v1.json", "OnTap API"));
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
