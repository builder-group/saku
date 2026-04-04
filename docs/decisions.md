# Decisions

## No Shopify `products/update` Webhook For Product Sync

We intentionally do not subscribe to Shopify `products/update` for Saku product snapshot sync.

Why:

- Saku has a free app tier, so we need to be conservative with DB and cache resource usage.
- `products/update` can fire very often on active shops, including product edits and variant changes.
- Handling those webhooks would require repeated app-side processing and DB/cache work even when the changed product is not relevant to a published Saku page.

What we do instead:

- We refresh Shopify product snapshots lazily in `prepareSiteContent()`.
- This means product data is refreshed when Saku is already doing real site work, instead of doing background sync for every Shopify edit.

Tradeoff:

- Public product sync is less immediate than a webhook-driven approach.
- If a public page is already cached, Shopify product changes will not appear until Saku prepares the site again and invalidates cache from that path.
