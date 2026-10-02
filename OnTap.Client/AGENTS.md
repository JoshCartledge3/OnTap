This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Required reading before client changes

Read this file before creating, editing, or reviewing client code. Treat the architecture below as a project requirement. Before adding a service, hook, or context, inspect the existing implementation for that concern and extend it where appropriate.

## Client architecture

### One concern, one service, one hook, optional one context

- Organize services around cohesive application concerns, such as pubs or pub runs.
- Each service has exactly one public hook and, only when shared state is needed, at most one context. The relationship is one service to one hook to one optional context.
- The single hook exposes the concern's state and operations. Multiple components can use it; do not create additional hooks for individual operations, filters, screens, or subsets of the concern.
- Extend the existing concern rather than inventing narrower services. For example, searching, listing, and finding nearby pubs belong in `PubsService` and `usePubs`; do not add `LocalPubsService`, `useLocalPubs`, or `usePubSearch` for those operations.
- Create a separate concern only when it has a distinct responsibility. Do not split files or layers merely to wrap another function.

### Dependency boundaries

```text
Component / screen -> Concern hook -> Concern service -> Generated API client
                            |
                            +-------> Optional concern context
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

### Enforced context boundary

- Place context modules in `src/contexts/` and name them `<Concern>Context.ts(x)`. Place public concern hooks in `src/hooks/use<Concern>.ts(x)`.
- ESLint's `no-restricted-imports` rule in `eslint.config.js` rejects static context imports/re-exports and named React `useContext` imports outside those hook files. Use static ES imports for client dependencies; do not use dynamic imports, CommonJS, or namespace access to bypass this boundary.
- Keep context implementation self-contained. Do not create barrel exports or alternative filenames to bypass the rule.
- Run `npm run lint` when changing the architecture rule.

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

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
