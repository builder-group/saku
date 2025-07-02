# Good to Know

## [Monorepo Dependency Bundling](https://github.com/builder-group/saku/issues/12)

When using workspace packages (e.g., `@repo/api-core`) that get bundled into the Remix app, be aware of potential version conflicts with transitive dependencies. Here's what can happen:

1. **Direct Bundling**: Workspace packages are bundled directly into the Remix app's `server/index.js` rather than being added as dependencies in `node_modules`.

2. **Version Conflicts**: If a transitive dependency exists with different versions:
   - Workspace package uses version X
   - Another package uses version Y
   - The bundled version might get "lost" in favor of the version in `node_modules`

Example we encountered:

```
@repo/api-core
└── xml-tokenizer@0.0.38 (bundled into server/index.js)

head-metadata
└── xml-tokenizer@0.0.32 (in node_modules)

Result: xml-tokenizer@0.0.38 got lost, code used 0.0.32 instead
```

### How to Handle This

- Be aware of version conflicts in transitive dependencies
- Lock versions across the monorepo where possible
- Monitor for unexpected version changes when updating dependencies
