# Shopify `Saku - Link In Bio` App

## 📐 Architecture

### Differences to [`shopify-app-template-remix`](https://github.com/Shopify/shopify-app-template-remix) template

#### 1. **Nested App Structure**

Due to the limitations of nesting `pnpm` workspaces, we've modified the project structure to work within our monorepo. The Shopify App is now nested under `apps/sfy-link-in-bio-app/app/` to fit within the monorepo structure defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/sfy-*-app/*'
  # ..
```

**Monorepo Structure:**
```
apps/sfy-link-in-bio-app/
├── app/
│   ├── env.d.ts
│   ├── package.json
│   ├── public/
│   │   └── favicon.ico
│   ├── README.md
│   ├── shopify.app.toml
│   ├── shopify.web.toml
│   ├── src/                    # Remix app directory
│   │   ├── entry.server.tsx
│   │   ├── globals.d.ts
│   │   ├── root.tsx
│   │   ├── routes/
│   │   │   ├── _index/
│   │   │   │   ├── route.tsx
│   │   │   │   └── styles.module.css
│   │   │   ├── app._index.tsx
│   │   │   ├── app.additional.tsx
│   │   │   ├── app.tsx
│   │   │   ├── auth.$.tsx
│   │   │   ├── auth.login/
│   │   │   │   ├── error.server.tsx
│   │   │   │   └── route.tsx
│   │   │   ├── webhooks.app.scopes_update.tsx
│   │   │   └── webhooks.app.uninstalled.tsx
│   │   ├── routes.ts
│   │   └── shopify.server.ts
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

**Template Structure:**
```
├── app/                        # Remix app directory (root level)
│   ├── db.server.ts
│   ├── entry.server.tsx
│   ├── globals.d.ts
│   ├── root.tsx
│   ├── routes/
│   │   ├── _index/
│   │   │   ├── route.tsx
│   │   │   └── styles.module.css
│   │   ├── app._index.tsx
│   │   ├── app.additional.tsx
│   │   ├── app.tsx
│   │   ├── auth.$.tsx
│   │   ├── auth.login/
│   │   │   ├── error.server.tsx
│   │   │   └── route.tsx
│   │   ├── webhooks.app.scopes_update.tsx
│   │   └── webhooks.app.uninstalled.tsx
│   ├── routes.ts
│   └── shopify.server.ts
├── CHANGELOG.md
├── Dockerfile
├── env.d.ts
├── extensions/                 # Extensions at app level
├── package-lock.json
├── package.json
├── prisma/                     # Database setup
│   ├── migrations/
│   │   └── 20240530213853_create_session_table/
│   │       └── migration.sql
│   └── schema.prisma
├── public/
│   └── favicon.ico
├── README.md
├── shopify.app.toml
├── shopify.web.toml
├── tsconfig.json
└── vite.config.ts
```

#### 2. **Remix App Directory Change**

The Remix application code moved from root-level `app/` to `src/` within the Shopify app folder. This required updating the [`appDirectory`](https://remix.run/docs/en/main/file-conventions/remix-config#appdirectory) configuration:

```ts
export default defineConfig({
	server: {
		fs: {
			allow: ['src', 'node_modules'] // Changed from default 'app'
		}
	},
	plugins: [
		remix({
			appDirectory: 'src' // Changed from default 'app'
		})
	]
}) satisfies UserConfig;
```

#### 3. **Removed Prisma/Database Dependencies**

- Removed `db.server.ts`
- Removed `prisma/` directory and all database migrations
- Using `MemorySessionStorage` instead of database session storage:

```ts
// shopify.server.ts
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';

export const shopifySessionStorage = new MemorySessionStorage();

const shopify = shopifyApp({
	// ...
	sessionStorage: shopifySessionStorage
	// ...
});
```

_Note: Session storage will be migrated to API-based storage in the future._

#### 4. **Extensions Placement**

Shopify Extensions will reside at the monorepo level (alongside the `apps/` directory) rather than within the Shopify App's `extensions/` folder, due to the workspace structure.

#### 5. **Removed Template Files**

- `CHANGELOG.md`
- `Dockerfile`
- `package-lock.json` (using `pnpm` instead)
- `extensions/` directory

#### 6. **Configuration Adjustments**

- **ESLint**: Custom configuration tailored to our project needs and coding standards
- **TypeScript Config**: Adjusted `tsconfig.json` to meet our project requirements
- **Package Management**: Modified `package.json` for specific dependencies and scripts, using `pnpm` workspaces

## 📚 Good to Know

### How to Create a Sales Channel App

1. Create the app via CLI: `shopify app dev --reset`
2. Follow the CLI prompts to generate the preview URL
3. **Don't click the preview URL yet** - go to Partner Dashboard first
4. Update app distribution to **Public**
5. Go to **API Access** (left sidebar) → **Sales channel** section
6. Click **Turn app into sales channel** and confirm

⚠️ **Notes**: 
- Creating the app manually first and then connecting it via the CLI might result in 404 errors when trying to install the app - the [Shopify docs](https://shopify.dev/docs/apps/build/sales-channels/start-building) don't explain the missing config
- The docs incorrectly state sales channel settings are under "Configuration" - they're actually under "API Access"
- This process cannot be reversed