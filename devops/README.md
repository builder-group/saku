# DevOps

Centralized deployment and infrastructure configuration for the Saku monorepo.

## Structure

```
devops/
├── docker-compose.yml              # Local development
├── .env.template                   # Copy to .env.local
└── sfy-link-in-bio-app/
    ├── Dockerfile
    └── fly.toml
```

## Usage

### Local Development

```bash
# Copy environment template
cp devops/.env.template devops/.env.local

# Start services
pnpm run docker:dev

# Stop services  
pnpm run docker:dev:down
```

### Production Deployment

```bash
# Build & deploy to Fly.io
pnpm run fly:deploy:sfy-link-in-bio
```

## ❓ FAQ

### Why centralized DevOps over per-app configs?

* `turbo prune` needs full repo access
* Turborepo must run from root for proper workspace resolution

### Why run Docker commands from the monorepo root?

All Docker actions (`build`, `deploy`) run from root to:

1. Resolve dependencies with `turbo prune`
2. Provide full context via `COPY . .`
3. Access shared packages like `@repo/types` and `@repo/api-core`

### How do I add a new app?

1. Create `devops/your-app/` with `Dockerfile` and `fly.toml`
2. Add commands to root `package.json`:
   ```json
   "docker:build:your-app": "docker build -f devops/your-app/Dockerfile -t saku-your-app .",
   "fly:deploy:your-app": "fly deploy -c devops/your-app/fly.toml"
   ```

## 💡 Resources / References

- [Dockerizing Turborepo Remix Application](https://medium.com/@joudwawad/dockerizing-turborepo-remix-application-fca679002c23)
