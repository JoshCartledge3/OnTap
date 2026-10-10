using OnTap.Api.Contracts;
using OnTap.Api.Entities;

namespace OnTap.Api.Mappers;

public static class UserMapper
{
    public static UserDto ToDto(UserEntity user) => new(user.Id, user.DisplayName);
}