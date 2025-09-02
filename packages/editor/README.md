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
type TFillMixin = TBaseMixin<'fill', { fills: TPaint[]; blendMode: string }>;
type TLayoutMixin = TBaseMixin<'layout', { padding: number; width: number | 'auto' }>;

// Nodes compose mixins for their specific needs
type TProductNode = TNode<'product', [
  TIdMixin,              // id: string
  TVisibleMixin,        // visible: boolean  
  TProductContentMixin, // content: { product: TProduct }
  TFillMixin,           // fill: { fills: TPaint[]; blendMode: string }
  TLayoutMixin          // layout: { padding: number; width: number | 'auto' }
]>;
```

### Why mixed approach (flat core + abstracted specialized) instead of all flat or all abstracted?

- **Core properties are universal**: Every node needs `visible`, `fill`, `stroke`, `shadow` - no conflicts at this level
- **Abstraction only when needed**: `TTextStyleMixin` and `TCtaStyleMixin` have specialized properties that could clash with core properties
- **Prevents style conflicts**: Complex nodes need multiple styled elements (text, CTA) - flat mixins would create key collisions
- **Semantic grouping**: UI elements like "text" and "CTA" are meaningful design concepts that belong together
- **ECS component overhead**: With SoA ECS, flat approach would require separate components (`TextFill`, `CtaFill`, ..) since entities can't have the same component multiple times

#### When to use flat vs abstracted mixins?

```typescript
// Simple node: Use flat core properties
type TRectangleNode = TNode<'rectangle', [
  TIdMixin,
  TAppearanceStyleMixin,    // visible, opacity, borderRadius
  TFillStyleMixin,          // fill paint and opacity
  TStrokeStyleMixin,        // stroke width and color
  TShadowStyleMixin         // shadow properties
]>;

// Complex node: Mix flat core + abstracted specialized
type TProductNode = TNode<'product', [
  TIdMixin,
  // Core properties (flat - no conflicts)
  TAppearanceStyleMixin,    // visible, opacity, borderRadius
  TFillStyleMixin,          // fill paint and opacity
  TStrokeStyleMixin,        // stroke width and color
  TShadowStyleMixin,        // shadow properties
  TAutoLayoutStyleMixin,        // basic padding/width
  // Specialized properties (abstracted to avoid conflicts)
  TTextStyleMixin,          // typography: { font, fontSize, textColor }
  TCtaStyleMixin            // CTA-specific styling
]>;

// In ECS: Core properties become separate components, specialized become composite
// components.Appearance[entityId] = { visible, opacity, borderRadius }
// components.Text[entityId] = { typography: { font, fontSize, textColor } }
```

### Why do all nodes use a variant-based content structure?

- **Start simple, grow complex**: Begin with basic variants (`'default'`, `'single'`) and add advanced variants later without breaking changes
- **Progressive enhancement**: Users start with simple functionality and can upgrade to more complex variants when needed
- **Future-proof architecture**: Easy to add specialized variants (multi-link, Instagram embed, product grid) without restructuring existing nodes
- **Consistent user experience**: Single node type with clear variant choices vs. confusing array of different node types

#### Examples of variant evolution:

```typescript
// Phase 1: Start simple
LinkNode: { content: { type: 'single', url: '...' } }

// Phase 2: Add specialized variants  
LinkNode: { content: { type: 'instagram', username: '...' } }
LinkNode: { content: { type: 'multi', title: '...', links: [...] } }

// Phase 3: Add advanced presentation variants
LinkNode: { content: { type: 'grid', columns: 2, links: [...] } }
LinkNode: { content: { type: 'carousel', autoplay: true, links: [...] } }

// Users upgrade variants, not node types
```

### Why don't nodes have card styling by default?

- **Default = Linktree style**: Everything is styled at the node layer level (card-like appearance)
- **Flat design flexibility**: Users can flatten styling by removing fill/stroke/shadow from nodes
- **Multi-item variants**: When content variants contain multiple items (link lists, product grids), individual items get card styling within a container
- **Progressive complexity**: Simple single-item nodes stay simple, complex multi-item nodes get appropriate card structure

#### When do we use card styling vs layer styling?

```typescript
// Single link: Style at layer level (default Linktree style)
LinkNode: { 
  fill: { paint: 'blue' }, 
  stroke: { width: 1 }, 
  shadow: { blur: 4 },
  content: { type: 'single', url: '...' } // Node IS the card
}

// Multiple links: Container + individual cards
LinkNode: {
  // Container styling (mixins)
  autoLayout: { gap: '8px' },
  fill: { paint: 'gray' },       // Container background
  card: {                        // Card mixin for individual links
    fill: { paint: 'white' },
    stroke: { width: 1 },
    shadow: { blur: 4 }
  },
  // Content data only
  content: { type: 'multi', title: 'My Links', links: [...] }
}

// Flat design: Remove layer styling
LinkNode: { 
  fill: null, stroke: null, shadow: null,
  content: { type: 'single', url: '...' } // Flat appearance
}
```

### What are tokens?

- **Design tokens for mixins**: Named presets for mixins (e.g., `text`, `button`, `fill`, `appearance`) stored at the site level (e.g., `tokens.text.default`).
- **How nodes use tokens**: A mixin is EITHER a token ref (mixin-level) OR a value object. In value mode, individual properties may use token refs for granular overrides. Its not possible to mix a mixin-level token ref with property values.
- **Why tokens**: Global consistency, simple theming/templates, and no schema churn. Local overrides remain possible when needed.

Example usage:

```typescript
// Site-level tokens (simplified)
tokens: {
  text: { default: { /* TTextStyle */ } },
  button: { default: { /* TButtonStyle */ },ctaPrimary: { /* TButtonStyle */ }, ctaSecondary: { /* TButtonStyle */ } },
  fill: { default: { /* TFillStyle */ } },
  appearance: { default: { visible: true, opacity: 1 } }
}

// Node references
// 1) Ref mode (mixin-level)
text: { type: 'token', ref: 'default' }
button: { type: 'token', ref: 'ctaPrimary' }
fill: { type: 'token', ref: 'default' }

// 2) Value mode with property-level token ref (no mixin-level ref here)
text: {
  typography: { fontSize: { type: 'token', ref: 'displayLg' } },
  fill: { type: 'token', ref: 'default' },
  stroke: null,
  shadow: null
}
```
