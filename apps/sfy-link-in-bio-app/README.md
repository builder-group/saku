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

### App Proxy

App proxies allow you to serve custom content directly from the store's domain (e.g., `shop.com/a/custom`) while keeping your app's logic separate. Perfect for custom pages, forms, APIs, or any storefront-facing functionality that needs Shopify data access.

#### Setup

**1. Add scope** in `shopify.app.toml` (if editing store content):

```toml
[access_scopes]
scopes = "write_app_proxy"  # Required when editing online store content
```

- [Shopify API access scopes](https://shopify.dev/docs/api/usage/access-scopes)

**2. Configure app proxy** in `shopify.app.toml`:

```toml
[app_proxy]
url = "https://your-tunnel.trycloudflare.com/app/proxy"
subpath = "custom"  # your custom path
prefix = "a"        # or "apps", "tools", "community"
```

- _Benefits (over admin UI configuration)_: Auto-syncs with latest Cloudflare tunnel URL on every `shopify app dev` restart.
- _Find your dev stores app proxy URL_: Admin → Settings → Apps and sales channels → [your app] → App proxy section

**3. Create Remix route**:

For HTML/JSON/Liquid Responses (Flexible)

```toml
[app_proxy]
url = "https://tunnel.com/app/proxy" # Can be any path
subpath = "custom"                   # Public URL: /a/custom
prefix = "a"
# Route: app.proxy.tsx ✅ (flexible naming)
```

For React Components (Strict Matching Required)

```toml
[app_proxy]
url = "https://tunnel.com/a/custom" # MUST match prefix+subpath
subpath = "custom"                  # Public URL: /a/custom
prefix = "a"
# Route: a.custom.tsx ✅ (MUST match /a/custom)
```

> ⚠️ **React requirement**: `url` must end with `/{prefix}/{subpath}` and route file must exactly match that path otherwise it won't work (e.g. Shopify might redirect to `auth/login`).

**4. Implementation**:

Handle POST requests (forms, API calls):

```ts
import { authenticate } from '../shopify.server';

export const action = async ({ request }) => {
	const { session, admin } = await authenticate.public.appProxy(request);

	const formData = await request.formData();
	// Process form data, make API calls, etc.
	return new Response('Success', { headers: { 'Content-Type': 'text/html' } });
};
```

Return HTML/JSON/Liquid content:

```ts
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
	const { session } = await authenticate.public.appProxy(request);

	const htmlContent = `<h1>Custom Page</h1><p>Hello from app proxy!</p>`;
	return new Response(htmlContent, {
		headers: { 'Content-Type': 'text/html' }
	});
};
```

Return React component/page:

```ts
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { AppProxyProvider } from '@shopify/shopify-app-remix/react';
import { authenticate } from '../shopify.server';

export async function loader({ request }) {
  await authenticate.public.appProxy(request);
  return { appUrl: process.env.SHOPIFY_APP_URL };
}

export default function Page() {
  const { appUrl } = useLoaderData();
  return (
    <AppProxyProvider appUrl={appUrl}>
      <h1>Custom Page</h1>
      <p>React component rendered via app proxy!</p>
    </AppProxyProvider>
  );
}
```

#### Usage

- **Public URL**: `https://shop-name.myshopify.com/a/custom`
- **Child routes**: `/a/custom/extra/path` automatically forwards to your app
- **Handles**: GET/POST requests, form submissions, AJAX calls
- **Returns**: HTML pages, Liquid templates, JSON APIs, file downloads
- **Access**: Shop context, customer authentication, Shopify API calls
- **Use cases**: Custom pages, product configurators, checkout extensions, data collection forms, webhooks

#### Limitations

- **No cookies**: Shopify strips `Cookie` and `Set-Cookie` headers for security
- **Headers stripped**: Many headers removed for security ([full list](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data#disallowed-headers))
- **Signature verification**: Always verify the `signature` parameter to ensure requests come from Shopify
- **React routing constraints**: When using `AppProxyProvider`, route files must match proxy URL exactly due to Remix URL rewriting limitations
- **No Polaris in proxies**: Shopify admin components don't work in app proxy context (public storefront vs admin context mismatch)

#### Resources

- [Display dynamic store data with app proxies](https://shopify.dev/docs/apps/build/online-store/display-dynamic-data)
- [Shopify App Proxies Explained](https://www.youtube.com/watch?v=ZiugtHDctFk)
- [AppProxyProvider](https://shopify.dev/docs/api/shopify-app-remix/v3/entrypoints/appproxyprovider)
- [Client side JavaScript does not work on app proxy pages](https://github.com/Shopify/shopify-app-template-remix/issues/436)
- [How To Deploy Your Shopify Apps](https://www.youtube.com/watch?v=DKswuVUyKaQ)