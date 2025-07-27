# 😬 Technical Debt

## `@shopify/polaris` Lock-in

We still use `@shopify/polaris` components because:

- **Missing Web Components**: Not all Polaris components have been ported to web components yet (e.g. `DropZone`, `IndexTable`, `Popover`, `Tooltip`, ..)

**Migration Strategy:**
- Use new web components (`<s-button>`, `<s-badge>`, `<s-text>`, etc.) where available
- Keep Polaris for components that don't have web component equivalents
- Requires dual provider setup: Shopify App React Router `AppProvider` + Polaris `AppProvider` for i18n (see `AppProviderWithPolaris.ts`)

## React v18 Lock-in

Several [Shopify packages require React 18](https://github.com/Shopify/shopify-app-template-remix/issues/955), preventing us from upgrading to React 19. Additionally, some packages like `react-email` use React 19, requiring us to force downgrade them to avoid version conflicts in the monorepo.

- `@shopify/app-bridge-ui-types` uses `^18.3.1`
- `@shopify/polaris` uses `^18.2.0`

### Current State

- Enforced via `pnpm-workspace.yaml` overrides to ensure single version:
  ```yaml
  overrides:
    '@types/react': '18.3.1'
    '@types/react-dom': '18.3.1'
    'react': '18.3.1'
    'react-dom': '18.3.1'
  ```
- Enforced via update script exclusion:
  ```json
  "update:latest": "pnpm update --latest '!react' '!react-dom' '!@types/react' '!@types/react-dom'"
  ```
- Blocks access to React 19 features and improvements
- Forces newer packages to use older React version

## ✅ RESOLVED: Remix Lock-in

> **Resolved:** Successfully migrated to React Router v7 following the [Shopify React Router migration guide](https://github.com/Shopify/shopify-app-template-react-router/wiki/Upgrading-from-Remix).

## ✅ RESOLVED: Zod-to-OpenAPI & Hono/zod-openapi Compatibility

> **Resolved:** The compatibility issue between `@hono/zod-openapi` and `@asteasolutions/zod-to-openapi` has been resolved since both packages now support Zod v4.

We use beta versions of both `@hono/zod-openapi` and `@asteasolutions/zod-to-openapi` because they have to use the same underlying Zod major version to avoid TypeScript type complexity and OOM errors during compilation. Mismatched versions could cause type explosion and make the project untypeable.

**Debugging:**

- If you hit TypeScript OOM or type recursion errors, check for duplicate or mismatched zod-to-openapi versions first.
- For deep-dive debugging, see: [Overcoming “JavaScript Heap Out of Memory Error” During TypeScript Compilation](https://carlrannaberg.medium.com/overcoming-javascript-heap-out-of-memory-error-during-typescript-compilation-in-a-mui5-react-21396cc8a4e1)
