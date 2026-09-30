using Microsoft.EntityFrameworkCore;
using OnTap.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

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
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
