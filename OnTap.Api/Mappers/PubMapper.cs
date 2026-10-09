using NetTopologySuite.Geometries;
using OnTap.Api.Contracts;
using OnTap.Api.Entities;

namespace OnTap.Api.Mappers;

public static class PubMapper
{
    public static PubDto ToDto(this PubEntity pub)
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

    public static PubEntity ToEntity(this OverpassElement overpassVenue)
    {
        var tags = overpassVenue.Tags;

        string? Tag(string key) => tags.GetValueOrDefault(key);

        bool? Flag(string key) => Tag(key) switch
        {
            "yes" => true,
            "no" => false,
            _ => null
        };

        var latitude = overpassVenue.Latitude ?? overpassVenue.Center!.Latitude;
        var longitude = overpassVenue.Longitude ?? overpassVenue.Center!.Longitude;

        var cash = Flag("payment:cash");
        var cards = Flag("payment:cards");
        var credit = Flag("payment:credit_cards");
        var debit = Flag("payment:debit_cards");

        bool? acceptsCard = null;

        if (cards == true || credit == true || debit == true)
            acceptsCard = true;
        else if (cards == false || (credit == false && debit == false))
            acceptsCard = false;

        var paymentMethods = (cash, acceptsCard) switch
        {
            (true, false) => PaymentMethodAcceptance.CashOnly,
            (false, true) => PaymentMethodAcceptance.CardOnly,
            (true, true) => PaymentMethodAcceptance.Both,
            _ => (PaymentMethodAcceptance?)null
        };

        var outdoorSeating = Flag("outdoor_seating");
        var beerGarden = Flag("beer_garden");

        bool? hasOutdoorSeating = null;

        if (outdoorSeating == true || beerGarden == true)
            hasOutdoorSeating = true;
        else if (outdoorSeating == false || beerGarden == false)
            hasOutdoorSeating = false;

        var sports = Tag("sport")?.Split(';', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries) ?? [];
        List<SportsBroadcaster> broadcasters = [];

        if (sports.Contains("sky_sports"))
            broadcasters.Add(SportsBroadcaster.SkySports);

        if (sports.Contains("tnt_sports"))
            broadcasters.Add(SportsBroadcaster.TntSports);

        return new PubEntity
        {
            OsmType = Enum.Parse<OsmType>(overpassVenue.Type, ignoreCase: true),
            OsmId = overpassVenue.Id,
            VenueType = Enum.Parse<VenueType>(tags["amenity"], ignoreCase: true),
            Name = tags["name"],
            Address = $"{Tag("addr:housenumber")} {tags["addr:street"]}".Trim(),
            Postcode = tags["addr:postcode"],
            Phone = Tag("phone") ?? Tag("contact:phone"),
            OpeningHours = Tag("opening_hours"),
            DogsAllowed = Flag("dog"),
            OutdoorSeating = hasOutdoorSeating,
            ServesFood = Flag("food"),
            WheelchairAccess = Tag("wheelchair") switch
            {
                "yes" => WheelchairAccess.Yes,
                "limited" => WheelchairAccess.Limited,
                "no" => WheelchairAccess.No,
                _ => null
            },
            SportsBroadcasters = broadcasters.Count > 0 ? broadcasters.ToArray() : null,
            PaymentMethodsAccepted = paymentMethods,
            Location = new Point(longitude, latitude) { SRID = 4326 }
        };
    }
}
