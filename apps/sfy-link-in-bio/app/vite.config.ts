import mdx from '@mdx-js/rollup';
import { reactRouter } from '@react-router/dev/vite';
import dotenv from 'dotenv';
import { reactRouterHonoServer } from 'react-router-hono-server/dev';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Load .env.local in development.
// Production builds get env vars from Docker/CI (see Dockerfile and fly.toml).
// https://v4.vitejs.dev/config/#using-environment-variables-in-config
if (process.env['NODE_ENV'] === 'development') {
	dotenv.config({ path: '.env.local' });
}

// Shopify CLI workaround: Use HOST as SHOPIFY_APP_URL (local dev only).
// The Shopify CLI sets HOST to the tunnel URL (e.g. ngrok/Cloudflare),
// but we use SHOPIFY_APP_URL throughout our config (allowedHosts, HMR, base). This ensures they're in sync.
// Production uses SHOPIFY_APP_URL from fly.toml/Dockerfile directly (no HOST).
// https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
if (
	process.env['HOST'] &&
	(!process.env['SHOPIFY_APP_URL'] || process.env['SHOPIFY_APP_URL'] === process.env['HOST'])
) {
	process.env['SHOPIFY_APP_URL'] = process.env['HOST'];
	delete process.env['HOST'];
}

const env = {
	// Build environment
	isProd: process.env['CI'] || process.env['DOCKER'], // Use CI/DOCKER to detect production builds (NODE_ENV is always 'production' during vite build)

	// Dev server config
	port: parseInt(process.env['PORT'] ?? '3000'),
	shopifyAppUrl: process.env['SHOPIFY_APP_URL'] ?? 'http://localhost:3000',
	frontendPort: parseInt(process.env['FRONTEND_PORT'] ?? '8002') // For remote HMR
};

export default defineConfig({
	// Absolute URLs for Shopify app proxy support.
	// Why: Dynamic imports don't respect <base> tag in Safari, so we generate absolute asset URLs.
	// This ensures assets load from our domain even when accessed via e.g. "shop.myshopify.com/a/saku/*".
	base: env.shopifyAppUrl.endsWith('/') ? env.shopifyAppUrl : `${env.shopifyAppUrl}/`,
	server: {
		port: env.port,
		hmr: getHmrConfig(),
		// Allow tunnel hostnames (Cloudflare/ngrok) for Shopify development
		allowedHosts: [new URL(env.shopifyAppUrl).hostname]
	},
	// Inject env vars as build-time constants
	define: {
		['import.meta.env.PACKAGE_VERSION']: validateAndStringify('npm_package_version'),
		['import.meta.env.VITE_API_CORE_URL']: validateAndStringify('VITE_API_CORE_URL'),
		['import.meta.env.VITE_POSTHOG_KEY']: validateAndStringify('VITE_POSTHOG_KEY'),
		['import.meta.env.VITE_POSTHOG_HOST']: validateAndStringify('VITE_POSTHOG_HOST'),
		['import.meta.env.VITE_MANTLE_APP_ID']: validateAndStringify('VITE_MANTLE_APP_ID'),
		['import.meta.env.VITE_CRISP_TOKEN']: validateAndStringify('VITE_CRISP_TOKEN')
	},
	ssr: {
		// Force these packages to be bundled for SSR (to prevent SSR module resolution issues)
		noExternal: ['posthog-js', 'posthog-js/react', 'validation-adapters', 'feature-react']
	},
	plugins: [
		mdx(),
		// Note: Using PostCSS (https://vite.dev/guide/features.html#postcss) instead of TailwindCSS Vite plugin because of following issues encountered in Shopify context:
		// - CSS loading twice in prod with URL imports (import stylesheet from './styles.css?url', See: https://github.com/remix-run/react-router/issues/12940)
		// - Hydration errors in dev with side-effect imports (import './styles.css')
		// PostCSS is the only solution that seems to work reliably in Shopify context.
		// tailwindcss(),
		reactRouterHonoServer({ serverEntryPoint: './src/.server/server.ts' }),
		reactRouter(),
		tsconfigPaths()
	],
	build: {
		// Prevent asset inlining (keep all assets as separate files)
		assetsInlineLimit: 0
	},
	optimizeDeps: {
		// Pre-bundle Shopify dependencies for faster dev server startup
		include: ['@shopify/app-bridge-react', '@shopify/polaris']
	}
}) satisfies UserConfig;

// =============================================================================
// Helpers
// =============================================================================

/**
 * Configure HMR for local vs remote development
 * - Local: WebSocket on port 64999
 * - Remote: Secure WebSocket via tunnel (Cloudflare/ngrok) for Shopify development
 */
function getHmrConfig() {
	const hostname = new URL(env.shopifyAppUrl).hostname;
	return hostname === 'localhost'
		? {
				protocol: 'ws' as const,
				host: 'localhost',
				port: 64999,
				clientPort: 64999
			}
		: {
				protocol: 'wss' as const,
				host: hostname,
				port: env.frontendPort,
				clientPort: 443
			};
}

/**
 * Validate and stringify env var for Vite's `define` option
 * - Production: Fail hard if missing (prevent corrupted builds)
 * - Development: Allow empty string (warn but continue)
 */
function validateAndStringify(key: string): string {
	const value = process.env[key];
	if (!value?.length) {
		// Production builds must have all env vars
		if (env.isProd) {
			throw new Error(`${key} is required for production builds`);
		}
		// Local dev: warn and continue with empty string
		console.warn(`[vite.config.ts] Warning: ${key} is not set`);
		return JSON.stringify('');
	}
	return JSON.stringify(value);
}
