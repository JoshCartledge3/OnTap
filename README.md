# OnTap
Monorepo for the OnTap API/Client Applications.

## Authentication

The Profile tab opens Auth0 Universal Login and supports signing out. Browsing
pubs remains public. Auth0 manages the client session and credentials; this step
does not create local user records or protect the API yet.

Copy `OnTap.Client/.env.example` to `OnTap.Client/.env` and set the Native
application's Domain and Client ID. The local `.env` is ignored by Git. Never
add a client secret to the app. The domain must also match the Auth0 plugin in
`OnTap.Client/app.json`.

In the OnTap Native application's Auth0 settings, add these values to both
**Allowed Callback URLs** and **Allowed Logout URLs**:

```text
ontap://dev-6p61uii3flewdqu3.us.auth0.com/ios/com.c.jxsh.ontap-client/callback
ontap://dev-6p61uii3flewdqu3.us.auth0.com/android/com.c.jxsh.ontapclient/callback
http://localhost:8081
```

For browser development, also add `http://localhost:8081` to **Allowed Web
Origins**. Enable Google and/or Apple under the application's Connections when
those providers are configured in Auth0. The app uses the enabled Universal
Login methods rather than handling passwords itself.

Auth0 adds native code, so rebuild the development app after installing it;
Expo Go and development builds created before Auth0 was added cannot run it.
From `OnTap.Client`, build a development client with `npm run ios`,
`npm run android`, or your existing EAS development-build workflow. Then use
`npm start` and test **Profile → Sign in**, returning to the app, cancelling
login, reopening the app, and **Sign out**. Check web separately with
`npm run web`.

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
