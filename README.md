# OnTap
Monorepo for the OnTap API/Client Applications.

## Local database

With Docker Desktop running, run these commands from the repository root:

```bash
docker compose up -d --wait db
dotnet ef database update --project OnTap.Api
```

The first command starts PostgreSQL/PostGIS. The second applies migrations to
create or update the tables. Run it again after pulling new migrations or
recreating the database volume, before importing pubs.

## UK pub data

Development imports read `OnTap.Api/Data/Development/osm-uk.json`. This file is
ignored by Git and must be supplied locally. Outside Development, the import
uses the UK Overpass request instead.

Apply the `RemoveBars` migration with the database update command above to
remove previously imported bars. Future imports accept only `amenity=pub`.

To refresh the local file, run this query in Overpass Turbo and save the raw
Overpass JSON response (with an `elements` array), rather than GeoJSON:

```overpass
[out:json][timeout:180];
area["ISO3166-1"="GB"]["admin_level"="2"]->.uk;
nwr["amenity"="pub"](area.uk);
out body center;
```

Replace `OnTap.Api/Data/Development/osm-uk.json` with the downloaded file, then
run the import from the repository root:

```bash
dotnet run --project OnTap.Api --launch-profile https \
  -p:SkipNswagGeneration=true -- --import-pubs
```

The command adds new venues and updates existing venues by OSM type and ID,
then exits. Entries missing a name or valid coordinates are skipped. Address
and postcode are optional; place, village, town and city are imported when
available. Venues absent from a later download are not automatically deleted.

Data © OpenStreetMap contributors, available under the
[Open Database License (ODbL)](https://www.openstreetmap.org/copyright).
