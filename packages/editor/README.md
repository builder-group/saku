# `@repo/editor`

## ❓ FAQ

### Why do nodes have a `content` property?

- Universal/editor properties (`id`, `type`, `name`, `visible`, `transform`, etc.) always stay flat at the top level
- If a property could be a mixin (shared by multiple node types, ECS-style), keep it flat
- Only put data in `content` if it's just for rendering that specific node type

### Why flat key-value structure instead of nested tree?

- **Efficient updates**: Update individual nodes without traversing entire tree
- **No rewrites**: Changes don't require rewriting large nested structures
- **On-demand reconstruction**: Hierarchy built only when needed for rendering
- **Cacheable**: Reconstructed trees can be cached for performance

### Why Pika IDs with prefixes?

- **Debugging**: `node_xyz` vs `asset_xyz` - instantly know what you're looking at
- **Cleanup**: `DELETE WHERE id LIKE 'temp_%'` - surgical data cleanup
- **Type safety**: Prevents accidentally mixing node and asset IDs

### Why asset IDs instead of content hashes?

- Same image with different `altText` needs separate records
- Metadata updates shouldn't change asset identity
- Cleaner references in nodes (`profilePicture: "asset_123"`)
- Content deduplication handled via `assetsByHash` lookup
