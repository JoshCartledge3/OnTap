# OnTap architecture

Read this root file before creating, changing, or reviewing project code. It is
the single source of architecture guidance for both OnTap.Api and OnTap.Client.
Do not add project-level AGENTS.md files or duplicate these rules elsewhere.
Inspect existing concern implementations before adding services, hooks, or contexts.

OnTap is a .NET 10 C# REST API with PostgreSQL/PostGIS and an Expo React Native
TypeScript client. Nearby pubs and planned pub runs are application concerns.

The complete request flow is:

```text
Client component -> concern hook -> client service
    -> onTapClient.<concern>Client -> generated NSwag client
    -> REST controller -> API service -> EF Core -> PostgreSQL/PostGIS

Concern hook -> optional concern context (shared state and setters)
App -> Providers -> concern providers -> app content
```

Keep concerns cohesive. Do not split pubs into pubs/local-pubs/search-pubs
services, hooks, or generated clients. Each client concern has one service, one
public hook, and at most one context/provider pair.

Keep implementation minimal and follow the user's current step. Do not add
loading/error state, abstractions, dependencies, build commands, or tests merely
in anticipation of future requirements. Do not regenerate clients or launch
servers when the user only requests documentation or scaffolding.

## API architecture

Paths in this section are relative to `OnTap.Api/`.

### Layers and responsibilities

- Use .NET 10 C# REST controllers, EF Core with Npgsql, and PostgreSQL/PostGIS.
- `Controllers/` defines routes, HTTP annotations, named operations, response
  metadata, and HTTP responses. Controllers call service interfaces; they do not
  access the DbContext or implement database/business logic.
- `Services/Abstraction/` holds concern service interfaces. `Services/` holds
  their implementations and coordinates business logic and database access.
- `Data/OnTapDbContext.cs` and `Data/Configurations/` define persistence and EF
  configuration. Keep entity configuration out of controllers.
- `Entities/` contains database entities such as `PubEntity`. These are not API
  response models.
- `Contracts/` contains request/response DTOs such as `PubDto`. Services used by
  controllers return DTOs rather than exposing persistence entities.
- Group related endpoint inputs in named request contracts in `Contracts/`
  rather than adding several scalar parameters to controller signatures.
  For GET searches/filters, bind the request contract with `[FromQuery]`;
  using a request object does not require POST or a GET request body.
  For example, `NearbyPubsRequest` groups `Latitude`, `Longitude`, and
  `RadiusMetres`, with `CancellationToken ct = default` as a separate parameter.
- Keep request contracts independent of persistence/spatial implementation types.
  Accept numeric coordinates, validate the request, and construct the service's
  spatial point using longitude as X, latitude as Y, and SRID 4326.
- `Mappers/` contains static concern mappers, such as `PubMapper.ToDto`. Keep
  entity-to-contract mapping there rather than repeating it in services.
- Pass cancellation tokens through controller, service, and asynchronous EF
  operations. Controllers accept `CancellationToken ct = default` separately
  from request contracts; forward that same token to the service and EF calls
  such as `ToListAsync(ct)`. Do not replace it with `CancellationToken.None`.

### Geography and migrations

- PostGIS is the chosen spatial extension. Pub locations use
  `geography(point,4326)` with a spatial index; longitude is X and latitude is Y.
- Use database spatial operations for radius/distance queries where appropriate.
  Keep those queries behind the API service/data-access boundary.
- Expose numeric latitude/longitude in DTOs; do not expose NetTopologySuite or
  PostGIS types in the public contract.
- API radius contracts use metres (`RadiusMetres`), matching PostGIS geography
  distance units. Name client picker state and hook/service inputs explicitly
  `radiusKilometres` when the UI uses kilometres; the client service converts once
  to `radiusMetres` before calling the generated API client. Do not convert metres
  again in the API or use ambiguous names such as `range` or `radiusRange`.
- Add migrations for actual database schema changes. A C# rename alone does not
  require a schema migration if the mapped database schema remains unchanged.
- Preserve existing migration history and data; do not drop/recreate the database
  as a routine development shortcut.

### OpenAPI and NSwag client generation

- Keep the existing ASP.NET Core OpenAPI generator and Swagger UI setup. Do not
  add a second schema generator just to group frontend clients.
- Give endpoints explicit HTTP attributes, stable named operations, and DTO
  response metadata. Group controllers with concern tags such as `[Tags("Pubs")]`.
- Export OpenAPI 3.0 for the current generation setup.
- `nswag.json` uses `className: "{controller}Client"` and
  `operationGenerationMode: "MultipleClientsFromFirstTagAndOperationId"`.
  The first tag defines the client group: `Pubs` produces `PubsClient`.
- Generate a real class per broad concern. Do not generate one `OnTapClient`
  and simply rename its instance to pretend that it is a concern client.
- API builds export the document and run NSwag.MSBuild after compilation, writing
  `../OnTap.Client/src/api/generated/client.ts`. Preserve the design-time,
  `DotNetWatchBuild`, and `SkipNswagGeneration` guards.
- Generated client code must not be hand-edited. Change the contract/metadata or
  NSwag configuration, then rebuild when generation is part of the requested step.
- Adding a generated concern client does not automatically register it in the
  frontend's handwritten `onTapClient` object; update that registration separately.

### Verification

Build the API for API code changes when appropriate. Respect explicit requests
to defer implementation or generation. Do not run database-dependent checks when
the database is intentionally stopped. No API build is needed for documentation-only changes.

## Client architecture

Paths and commands in the remaining sections are relative to `OnTap.Client/`,
unless an API or repository path is explicitly given.
Prioritize mobile-first patterns, performance, and cross-platform compatibility.


### One concern, one service, one hook, optional one context

- Organize services around cohesive application concerns, such as pubs or pub runs.
- Each service has exactly one public hook and, only when shared state is needed, at most one context. The relationship is one service to one hook to one optional context.
- The single hook exposes the concern's state and operations. Multiple components can use it; do not create additional hooks for individual operations, filters, screens, or subsets of the concern.
- Extend the existing concern rather than inventing narrower services. For example, searching, listing, and finding nearby pubs belong in `PubsService` and `usePubs`; do not add `LocalPubsService`, `useLocalPubs`, or `usePubSearch` for those operations.
- Create a separate concern only when it has a distinct responsibility. Do not split files or layers merely to wrap another function.

### Dependency boundaries

```text
Component / screen -> Concern hook -> Concern service
Concern service -> onTapClient.<concern>Client -> Generated NSwag client
Concern hook -> Optional concern context
```

- The concern hook is the only entry point from components and screens into that concern's data and operations.
- Components and screens must not call services, instantiate the generated API client, make API requests directly, or read/write the concern's context directly. Import DTO types when needed; type imports do not bypass this boundary.
- Only the concern hook calls its service and imports/consumes its optional context. Components and screens must not import context files, even to mount a provider. If provider composition is needed, expose it through the concern's hook module while keeping the raw context private.
- Services must never import or know about hooks, React, components, or contexts.
- Contexts and their providers must never import or know about services. The hook coordinates the two; neither depends on the other.

### Where logic belongs

1. **Service:** API communication and any concern-specific logic that can run independently of React. Use the generated client for API calls. Keep data transformation, validation, and reusable business rules here when they do not require React state or lifecycle.
2. **Hook:** React state, effects, request lifecycle, loading/error state, and coordination with the optional context. Put logic here only when it cannot reasonably live in the service because it requires React or connects service results to UI state.
3. **Context/provider:** Minimal shared state storage and provider wiring. Expose state and the setters/dispatch needed by the hook. Do not fetch data, transform results, implement business rules, or orchestrate operations here. Any such logic requiring context access belongs in the hook.
4. **Component/screen:** Rendering, styles, presentation-only state, and user interactions that invoke the concern hook's operations.

### Asynchronous operation naming

- Public client service and hook operations that return a Promise use the `Async`
  suffix, such as `getCurrentUserLocationAsync` or `getPubsInRangeAsync`.
  This applies even when a function forwards a Promise without the `async` keyword.
- Hooks expose the same operation names, including the `Async` suffix; do not
  remove it through aliases in the returned object.
- Hook functions retain names such as `useLocation` and `usePubs`. Hooks themselves
  are synchronous and must not be declared `async`.
- Component event handlers may use intent-based names such as `onGetNearbyPubs`,
  even when their implementation is asynchronous.
- Preserve generated NSwag client method names, such as `getPubsInRange`.
  Do not hand-edit generated code to add the `Async` suffix.

### Client logging

- Log only errors, using `console.error` in client services. Include the
  service/operation and the actual caught error so API response details remain
  available for inspection.
- Do not log from hooks, contexts/providers, or components. Components may still
  show user-facing error messages; that is separate from diagnostic logging.
- Do not add `__DEV__` guards, progress/success logs, timing logs, or cancellation
  logs. Expected request cancellation is not an error.
- After logging a failure, rethrow the original error. Logging must not change
  returned data, swallow failures, or introduce fallback results.

### Request cancellation

- Use `AbortController`/`AbortSignal` for client HTTP cancellation and
  `CancellationToken` for API operations. Keep NSwag's Fetch
  `useAbortSignal: true` configuration; regenerate rather than hand-editing the
  generated client when its configuration changes.
- The concern hook owns the request lifecycle. For replaceable searches such as
  nearby pubs, keep the active controller in a ref, abort the previous request
  before starting another, and abort the active request during effect cleanup.
- Client services accept an optional `signal?: AbortSignal` and pass it through
  to the generated client. Services do not own React lifecycle or controllers.
- Use `await` inside service `try` blocks so asynchronous request failures reach
  their `catch`. Skip error logging when the supplied signal is aborted, but
  rethrow so the hook can handle the cancellation.
- The hook ignores an aborted request's result and handles its cancellation
  silently. Genuine failures still propagate to the caller. Before updating
  context, check that the request's signal has not been aborted.
- In `finally`, clear the active controller only if it is still the controller
  for that request; an older request must not clear a newer request's controller.
- A hook-local controller coordinates only that hook instance. If multiple hook
  instances must coordinate writes to the same shared search results, design
  shared request ownership explicitly; do not assume their refs are shared.
- Pass cancellation through the complete HTTP/API/database flow. Cancellation
  is cooperative; retain the client result guard even when the API accepts a
  cancellation token. Do not substitute a request counter for supported HTTP
  cancellation.

### Generated concern clients and `onTapClient`

- The API build generates genuine concern classes such as `PubsClient` and, when those endpoints exist, `PubRunsClient` or `LocationClient`. Do not imitate grouping by renaming a single generated `OnTapClient` instance.
- Generated code lives in `src/api/generated/client.ts`. Never hand-edit it. API tags and `OnTap.Api/nswag.json` determine client grouping; API builds regenerate it.
- `src/api/onTapClient.ts` is a small handwritten registration object that constructs and exposes the generated clients as properties:

  ```ts
  export const onTapClient = {
      pubsClient: new PubsClient(developmentSettings.apiBaseUrl, {
          fetch: globalThis.fetch.bind(globalThis),
      }),
  };
  ```

- Services use `onTapClient.pubsClient.getPubs()`. The agreed public shape is `onTapClient.<concern>Client.<operation>()`, rather than `getPubsClient()` factory methods.
- Add a registration only after its generated class exists. Adding API endpoints/classes does not automatically edit this object.
- Centralize client creation and shared transport configuration here. Do not construct clients separately inside each service or add business logic to this object.
- Bind the injected Fetch implementation to `globalThis`; passing bare `{ fetch }` lets the generated client call it with the wrong receiver and can cause browser `Illegal invocation` errors.
- Only client services call this API object. Hooks and components must not bypass the service layer. DTO type imports are allowed.
- `src/settings/development.ts` stores development configuration values such as `apiBaseUrl`, not client instances. It is explicitly imported and does not automatically switch environments like .NET appsettings files.
- Keep pubs searches, filters, and nearby operations in the pubs concern. A separate location client is appropriate only for an independently defined location concern.

### Shared state and the pubs flow

- Pubs currently uses shared context state. Store `pubs` and `setPubs` in `PubsContext`/`PubsProvider`. Do not add loading, error, or other context properties until requested.
- `useState` for shared values belongs in the context provider. Do not duplicate those values with hook-local state; separate hook instances must observe the same provider state.
- `usePubs` consumes context, calls `pubsService.getPubsAsync()`, and writes the returned DTOs using `setPubs`. It exposes `pubs` and `getPubsAsync` to components; keep setters internal unless the user explicitly requires direct updates.
- Contexts/providers contain state storage and wiring only. Services contain API/non-React logic. Hooks coordinate the service result and context setters. Services and contexts never know about each other.
- Do not fetch automatically on mount unless requested. A test component can invoke the hook operation from a button.
- State setters use React's `Dispatch<SetStateAction<T>>` signature so they accept either a value or an updater function.

### Provider composition

- Keep the concern context and its provider together in `src/contexts/<Concern>Context.tsx`.
- Keep the app-wide composition component in `src/providers/Providers.tsx`. It accepts `children` and nests the required concern providers; it contains no fetching or business logic.
- Export a concern provider through its hook module and the `src/hooks/index.ts` barrel, alongside the hook. The composition component imports providers from `../hooks`, not directly from context files, to preserve the lint boundary.
- `App.tsx` imports the composition component from `./src/providers/Providers` and wraps app content in it. Do not maintain a duplicate composition component in `src/components/`.
- Components consume concern state/operations through hooks; mounting a provider through the public hook module does not expose the raw context.

### Component organisation and styles

- Keep small components and their `StyleSheet.create()` definitions in one `.tsx` file, with styles outside/below the component function. Do not create separate style files by default.
- Use native components such as `View` and `Text` and their `style` prop. Native iOS/Android styling uses JavaScript objects rather than CSS Modules. Browser-only CSS is not a replacement for native styles.
- Use `import type` for React/DTO types. Avoid introducing extra files or layers for trivial wrappers.

### Contexts are optional

- Do not add a context automatically when adding a service and hook.
- Use hook-local state when the consuming component can own the state.
- Add the concern's single context only when consumers need to share the same state across the component tree. Separate calls to a hook with local state do not automatically share state.
- Adding a context must preserve the same hook as the component-facing API.

### Before completing a client change

- Confirm every concern still has one service, one public hook, and at most one context.
- Confirm components access the concern only through its hook.
- Confirm services and contexts have no dependency on each other.
- Confirm the context contains only minimal state/provider wiring, with reusable logic in the service and React-specific coordination in the hook.
- Do not introduce extra concern hooks, service subdivisions, or context logic to work around these rules.

### Enforced service and context boundaries

- Place context modules in `src/contexts/` and name them `<Concern>Context.ts(x)`. Place public concern hooks in `src/hooks/use<Concern>.ts(x)`.
- Place services in `src/services/` and name them `<Concern>Service.ts`. ESLint rejects static service imports/re-exports outside the concern hook files. Components, contexts, utilities, and other services must not import services.
- ESLint's `no-restricted-imports` rule in `eslint.config.js` rejects static context imports/re-exports and named React `useContext` imports outside those hook files. Use static ES imports for client dependencies; do not use dynamic imports, CommonJS, or namespace access to bypass this boundary.
- Keep context implementation self-contained. Do not create barrel exports or alternative filenames to bypass the rule.
- Run `npm run lint` when changing the architecture rule.
- These restrictions are configured directly in `eslint.config.js` using built-in rules. Do not recreate a separate custom-rule implementation or lint-rule test suite.

## Local startup

- `npm start` invokes `scripts/start-with-api.sh start`: stop any running instance of this project's API on its development ports, build/start its HTTPS development profile, wait until it responds, then run Expo. Never reuse an existing API process; it may contain outdated routes or code. Do not terminate unrelated processes occupying those ports.
- `npm run web` delegates to `npm start -- --web`, using the same API startup wrapper while opening the browser version. Direct `npx expo start` bypasses the wrapper.
- Keep this integration limited to `npm start`. Do not add native/bundle build commands or wrap every platform command unless explicitly requested.
- Cleanup stops the API started by the wrapper. Restarting a pre-existing instance of this project's API is intentional. The database is started separately in Docker Desktop.
- The startup script detects the host's LAN IPv4 address and exports `EXPO_PUBLIC_API_URL` for Expo. It is recalculated each run, never committed. An explicit environment override is allowed when multiple network interfaces make detection ambiguous.
- Keep client configuration in `src/settings/development.ts`: native development reads `EXPO_PUBLIC_API_URL`; web uses `https://localhost:7243`. Direct Expo commands need the environment variable supplied separately for native development.
- Development API profiles bind HTTP to `0.0.0.0:5164`. HTTPS redirection applies outside Development. Physical devices use local HTTP and must share a network that permits connections to the API; localhost refers to the device itself. Browser requests use the existing development CORS policy.
- SDK 57's native template permits local networking on iOS (`NSAllowsLocalNetworking`) and cleartext traffic in Android Debug builds. Do not disable transport security globally for release builds or add native dependencies just for this setup.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck for client code changes and report existing failures honestly. Documentation-only changes need a consistency review, not API generation or server startup.

## Navigation & Routing

- The current app uses `App.tsx`; Expo Router is not currently installed. Do not introduce routing as part of unrelated work. When navigation is needed, use **Expo Router**, with routes under `src/app/` and non-route code outside that folder.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
