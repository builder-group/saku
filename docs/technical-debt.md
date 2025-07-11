# 😬 Technical Debt

## React 18 & Remix Lock-in

Several [Shopify packages require React 18](https://github.com/Shopify/shopify-app-template-remix/issues/955), preventing us from upgrading to React 19 and thus React Router 7. Additionally, some packages like `react-email` use React 19, requiring us to force downgrade them to avoid version conflicts in the monorepo.

### Current State

- Enforced via `pnpm-workspace.yaml` overrides to ensure single version:
  ```yaml
  overrides:
    "@types/react": "18.3.1"
    "@types/react-dom": "18.3.1"
    "react": "18.3.1"
    "react-dom": "18.3.1"
  ```
- Enforced via update script exclusion:
  ```json
  "update:latest": "pnpm update --latest '!react' '!react-dom' '!@types/react' '!@types/react-dom'"
  ```
- Blocks access to React 19 features and improvements
- Forces newer packages to use older React version

### Resolution Path

1. Monitor Shopify packages for React 19 support (e.g. [#955](https://github.com/Shopify/shopify-app-template-remix/issues/955))
2. Remove React version overrides from `pnpm-workspace.yaml`
3. Update "update:latest" scripts
4. Update React-related dependencies
