# 🐛 Issues

## App Proxy Meta Tags in Development

App Proxy routes (`/a/saku/*`) meta tags don't work in development through Cloudflare tunnel, but work fine in production.

**Location**: `/a.saku.$/route.tsx`

**Current State**:

- ✅ Production: Meta tags work perfectly
- ❌ Development: Meta tags don't work through Cloudflare tunnel
- ✅ Regular routes (`/w/*`) work fine in both dev and prod

**Workaround**: Meta tags are injected server-side in production where it matters for SEO.

**Note**: This is specific to App Proxy routing limitations, not a general React Router issue.

## App Proxy Signature Validation in Production

Official Shopify App Proxy authentication fails reliably in production, but works in development.

**Location**: `/authenticate-app-proxy.ts`

**Current State**:

- ❌ Production: Official authentication fails
- ✅ Development: Official authentication works
- ✅ Production: Fallback signature recalculation works

**Workaround**: Implemented fallback signature recalculation mechanism that:

1. Tries official authentication first
2. Falls back to manual signature recalculation
3. Tracks authentication method for analytics (`official` | `fallback` | `unverified`)

**References**:

- [GitHub Issue #455](https://github.com/Shopify/shopify-app-js/issues/455)
- [GitHub Issue #2374](https://github.com/Shopify/shopify-app-js/issues/2374)
