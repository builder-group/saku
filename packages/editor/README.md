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

### Why did we choose a mixin-based approach for nodes?

- **Zero breaking changes**: Add new properties by creating new mixins without affecting existing code
- **Infinite extensibility**: Mixins can represent any data type (objects, primitives, arrays, booleans)
- **ECS migration ready**: Each mixin can become a separate component entity in the future
- **Type safety**: TypeScript knows exactly what properties exist on each node type
- **Composable**: Easy to mix and match mixins for different node capabilities
- **KISS principle**: Simple concept that scales without complexity

#### How does the mixin system work?

```typescript
// Each mixin has a unique key and value
type TFillMixin = TMixin<'fill', { fills: TPaint[]; blendMode: string }>;
type TLayoutMixin = TMixin<'layout', { padding: number; width: number | 'auto' }>;

// Nodes compose mixins for their specific needs
type TProductNode = TNode<'product', [
  TIdMixin,              // id: string
  TVisibleMixin,        // visible: boolean  
  TProductContentMixin, // content: { product: TProduct }
  TFillMixin,           // fill: { fills: TPaint[]; blendMode: string }
  TLayoutMixin          // layout: { padding: number; width: number | 'auto' }
]>;
```

### Why composite mixins (CardMixin, CTAMixin) instead of flat atomic mixins?

- **Prevents style conflicts**: Complex nodes need multiple styled elements (card, text, CTA) - flat mixins would create key collisions
- **Semantic grouping**: UI elements like "card" and "CTA" are meaningful design concepts that belong together
- **Helper functions reusable**: `resolveFillMixin(node.card.fill)` works with existing atomic resolvers
- **ECS component overhead**: With SoA ECS, flat approach would require separate components (`CardFill`, `CtaFill`, `TextFill`) since entities can't have the same component multiple times. Composite mixins avoid this proliferation.

#### When to use composite vs atomic mixins?

```typescript
// Single styled element: Use atomic mixins
type TRectangleNode = TNode<'text', [
  TIdMixin,
  TAppearanceMixin,    // Direct atomic mixin  
  TFillMixin,          // Direct atomic mixin
  TStrokeMixin,        // Direct atomic mixin
  TShadowMixin         // Direct atomic mixin
]>;

// Multiple styled elements: Use composite mixins to prevent conflicts
type TProductNode = TNode<'product', [
  TIdMixin,
  TProductContentMixin,   // content: { product: TProduct }
  TCardMixin,             // Composite: { layout, appearance, fill, stroke, shadow }
  TTextMixin,             // Composite: { typography, appearance }  
  TCtaMixin               // Composite: { layout, appearance, typography, fill, stroke, shadow }
]>;

// In ECS: Each composite becomes a single component array
// components.Card[entityId] = { layout, appearance, fill, stroke, shadow }
// components.Cta[entityId] = { layout, appearance, typography, fill, stroke, shadow }
```