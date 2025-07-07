// import mdx from '@mdx-js/rollup';
import mdx from '@mdx-js/rollup';
import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals({ nativeFetch: true });

// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the remix server. The CLI will eventually
// stop passing in HOST, so we can remove this workaround after the next major release.
if (
	process.env['HOST'] &&
	(!process.env['SHOPIFY_APP_URL'] || process.env['SHOPIFY_APP_URL'] === process.env['HOST'])
) {
	process.env['SHOPIFY_APP_URL'] = process.env['HOST'];
	delete process.env['HOST'];
}

const host = new URL(process.env['SHOPIFY_APP_URL'] ?? 'http://localhost').hostname;

let hmrConfig;
if (host === 'localhost') {
	hmrConfig = {
		protocol: 'ws',
		host: 'localhost',
		port: 64999,
		clientPort: 64999
	};
} else {
	hmrConfig = {
		protocol: 'wss',
		host: host,
		port: parseInt(process.env['FRONTEND_PORT'] ?? '8002'),
		clientPort: 443
	};
}

export default defineConfig({
	server: {
		allowedHosts: [host],
		cors: {
			preflightContinue: true
		},
		port: parseInt(process.env['PORT'] ?? '3000'),
		hmr: hmrConfig,
		fs: {
			// See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
			allow: ['src', 'node_modules']
		}
	},
	define: {
		['import.meta.env.PACKAGE_VERSION']: JSON.stringify(process.env['npm_package_version'])
	},
	ssr: {
		noExternal: [
			'posthog-js',
			'posthog-js/react',
			// Fix: validation-adapters sub-exports (/valibot, /zod) cause SSR module resolution issues
			// Might be not necessary if we update validation-adapters package.json exports to use nested conditional exports correctly?
			'validation-adapters',
			'feature-react'
		]
	},
	plugins: [
		tailwindcss(),
		mdx(),
		remix({
			ignoredRouteFiles: ['**/.*'],
			appDirectory: 'src',
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_lazyRouteDiscovery: true,
				v3_singleFetch: false,
				v3_routeConfig: true
			}
		}),
		tsconfigPaths()
	],
	build: {
		assetsInlineLimit: 0
	},
	optimizeDeps: {
		include: ['@shopify/app-bridge-react', '@shopify/polaris']
	}
}) satisfies UserConfig;
