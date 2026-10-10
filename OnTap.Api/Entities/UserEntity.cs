namespace OnTap.Api.Entities;

public class UserEntity
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required string AuthSubject { get; set; }
    public string? DisplayName { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}