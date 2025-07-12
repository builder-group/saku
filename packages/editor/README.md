# `@repo/editor`

## ❓ FAQ

### Why do nodes have a `content` property?

- Universal/editor properties (`id`, `type`, `name`, `visible`, `transform`, etc.) always stay flat at the top level
- If a property could be a mixin (shared by multiple node types, ECS-style), keep it flat
- Only put data in `content` if it's just for rendering that specific node type
