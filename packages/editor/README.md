# `@repo/editor`

## ❓ FAQ

### Why bundle-based nodes instead of content variants?

- **True ECS principles**: Content is just another component/mixin, not special
- **Explicit & type-safe**: `bundleType` explicitly defines which mixins exist
- **Flexible bundling**: Easy to mix content variants with different style sets
- **Clear discrimination**: `type` = what it is, `bundleType` = how it's built
- **Component registry**: Bundles enable clean lookups: `registry[node.type][node.bundleType]`

```ts
// Bundle-based approach
type TLinkNode =
	| TClassicLinkNodeBundle      // { bundleType: 'classic', content: {...}, text: {...}, image: {...} }
	| TYouTubeEmbedLinkNodeBundle // { bundleType: 'youtube-embed', content: {...}, text: {...} }
	| TSpotifyEmbedLinkNodeBundle; // { bundleType: 'spotify-embed', content: {...}, text: {...} }

// Type-safe discrimination
if (node.type === 'link' && node.bundleType === 'classic') {
	node.content.url; // ✅ TypeScript knows content variant is 'classic'
	node.image; // ✅ TypeScript knows image mixin exists
	node.buttonPrimary; // ❌ Type error - classic bundle doesn't have this
}
```

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
- Cleaner references in nodes (`image: "asset_123"`)
- Content deduplication handled via `assetsByHash` lookup

### Why did we choose a mixin-based approach for nodes?

- **Zero breaking changes**: Add new properties by creating new mixins without affecting existing code
- **Infinite extensibility**: Mixins can represent any data type (objects, primitives, arrays, booleans)
- **ECS migration ready**: Each mixin can become a separate component entity in the future
- **Type safety**: TypeScript knows exactly what properties exist on each node type
- **Composable**: Easy to mix and match mixins for different node capabilities
- **KISS principle**: Simple concept that scales without complexity

#### How does the mixin system work?

```ts
// Each mixin has a unique key and value
type TFillMixin = TBaseMixin<'fill', { fills: TPaint[]; blendMode: string }>;
type TLayoutMixin = TBaseMixin<'layout', { padding: number; width: number | 'auto' }>;

// Bundles define mixin recipes
type TClassicLinkNodeBundle = TNodeBundle<
	'classic',
	[
		TIdMixin, // id: string
		TLinkNodeMixin, // type: 'link'
		TClassicLinkContentMixin, // content: { type: 'classic', url: string }
		TFillMixin, // fill: { fills: TPaint[]; blendMode: string }
		TLayoutMixin // layout: { padding: number; width: number | 'auto' }
	]
>;
```

### Why mixed approach (flat core + abstracted specialized) instead of all flat or all abstracted?

- **Core properties are universal**: Every node needs `visible`, `fill`, `stroke`, `shadow` - no conflicts at this level
- **Abstraction only when needed**: `TTextStyleMixin` and `TCtaStyleMixin` have specialized properties that could clash with core properties
- **Prevents style conflicts**: Complex nodes need multiple styled elements (text, CTA) - flat mixins would create key collisions
- **Semantic grouping**: UI elements like "text" and "CTA" are meaningful design concepts that belong together
- **ECS component overhead**: With SoA ECS, flat approach would require separate components (`TextFill`, `CtaFill`, ..) since entities can't have the same component multiple times

### Why don't nodes have card styling by default?

- **Default = Linktree style**: Everything is styled at the node layer level (card-like appearance)
- **Flat design flexibility**: Users can flatten styling by removing fill/stroke/shadow from nodes
- **Multi-item variants**: When content variants contain multiple items (link lists, product grids), individual items get card styling within a container
- **Progressive complexity**: Simple single-item nodes stay simple, complex multi-item nodes get appropriate card structure

#### When do we use card styling vs layer styling?

```ts
// Classic link: Style at layer level (default Linktree style)
LinkNode: {
  fill: { paint: 'blue' },
  stroke: { width: 1 },
  shadow: { blur: 4 },
  content: { type: 'classic', url: '...' } // Node IS the card
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
  fill: null,
  stroke: null,
  shadow: null,
  content: { type: 'classic', url: '...' } // Flat appearance
}
```

### What are tokens?

- **Design tokens**: Named presets stored at the site level
- **How nodes use tokens**: Mixins can reference tokens via `TRef<Value, Token>` - either a token ref or direct value
- **Why tokens**: Global consistency, simple theming/templates, and no schema churn. Local overrides remain possible when needed

Example usage:

```ts
// Site-level tokens
tokens: {
  text: { default: { /* TTextStyleMixin */ } },
  fill: { default: { /* TFillStyleMixin */ } },
  appearance: { default: { visible: true, opacity: 1 } }
}

// Token ref
text: { type: 'token', key: 'text.default', tokenType: 'text' }
fill: { type: 'token', key: 'fill.default', tokenType: 'fill' }
```
