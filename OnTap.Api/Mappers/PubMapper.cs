using System.Linq.Expressions;
using NetTopologySuite.Geometries;
using OsmOpeningHours;
using OnTap.Api.Contracts;
using OnTap.Api.Entities;

namespace OnTap.Api.Mappers;

public static class PubMapper
{
    private static readonly OpeningHoursEvaluationContext OpeningHoursContext = new(
        TimeZoneInfo.FindSystemTimeZoneById("Europe/London"));

    public static readonly Expression<Func<PubEntity, PubEntity>> SummaryFields = pub => new PubEntity
    {
        Id = pub.Id,
        Name = pub.Name,
        Address = pub.Address,
        Postcode = pub.Postcode,
        Place = pub.Place,
        Village = pub.Village,
        Town = pub.Town,
        City = pub.City,
        Location = pub.Location,
        OpeningHours = pub.OpeningHours
    };

    public static PubSummaryDto ToDto(this PubEntity pub, DateTimeOffset now)
    {
        var locality = pub.Town ?? pub.Village ?? pub.City ?? pub.Place;
        var address = string.Join(", ", new[] { pub.Address, locality, pub.Postcode }
            .Where(value => !string.IsNullOrWhiteSpace(value)));

        return new PubSummaryDto(
            pub.Id,
            pub.Name,
            string.IsNullOrEmpty(address) ? "No address available" : address,
            pub.Location.Y,
            pub.Location.X,
            GetIsOpenNow(pub.OpeningHours, now));
    }

    private static bool? GetIsOpenNow(string? openingHours, DateTimeOffset now)
    {
        if (string.IsNullOrWhiteSpace(openingHours)
            || !OpeningHoursParser.TryParse(openingHours, out var schedule, out _)
            || schedule!.RequiredEvaluationFeatures.HasFlag(OpeningHoursFeatureFlags.RequiresHolidayCalendar))
            return null;

        return schedule.Evaluate(now, OpeningHoursContext).State switch
        {
            OpeningHoursState.Open => true,
            OpeningHoursState.Closed => false,
            _ => null
        };
    }

    public static PubEntity ToEntity(this OverpassElement overpassVenue)
    {
        var tags = overpassVenue.Tags;

        string? Tag(string key) => tags.TryGetValue(key, out var value) && !string.IsNullOrWhiteSpace(value)
            ? value.Trim() : null;

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

        var address = $"{Tag("addr:housenumber")} {Tag("addr:street")}".Trim();

        return new PubEntity
        {
            OsmType = Enum.Parse<OsmType>(overpassVenue.Type, ignoreCase: true),
            OsmId = overpassVenue.Id,
            Name = tags["name"],
            Address = string.IsNullOrEmpty(address) ? null : address,
            Postcode = Tag("addr:postcode"),
            Place = Tag("addr:place"),
            Village = Tag("addr:village"),
            Town = Tag("addr:town"),
            City = Tag("addr:city"),
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
