using OnTap.Api.Contracts;
using OnTap.Api.Entities;

namespace OnTap.Api.Mappers;

public static class PubMapper
{
    public static PubDto ToDto(PubEntity pub)
    {
        return new PubDto(
            pub.Id,
            pub.Name,
            pub.Address,
            pub.Postcode,
            pub.Location.Y,
            pub.Location.X,
            pub.Status.ToString(),
            pub.CreatedAt);
    }
}
