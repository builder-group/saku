/**
 * Local development app proxy route
 *
 * Re-exports from the main saku route to avoid app proxy path conflicts.
 * Shopify only allows one app per proxy path - if local and prod both use
 * "saku" and are installed on the same store, one would get renamed to "saku-2" silently.
 *
 * Local: /a/saku-local/* | Prod: /a/saku/*
 */

// Re-export all route exports from the main saku route
export { default, loader } from '../a.saku.$/route';
