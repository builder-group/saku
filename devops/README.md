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

## Local Development

```bash
# Copy environment template
cp devops/.env.template devops/.env.local

# Start services
pnpm docker:dev

# Stop services
pnpm docker:dev:down
```

## Deploy a New App

### 1. Create deployment config

```bash
mkdir devops/your-app
```

### 2. Create Dockerfile

Research Docker best practices for your specific app type (Node.js API, Remix app, etc.) while keeping monorepo context in mind:

- **Remix apps**: Use Node.js base image, install pnpm, run Remix build
- **Node.js APIs**: Use appropriate base image, handle API-specific dependencies
- **Always use**: `turbo prune @repo/your-app --docker` for workspace management
- **Reference**: See `devops/sfy-link-in-bio-app/Dockerfile` as Remix example

Update key parts:

- `turbo prune @repo/your-app --docker`
- `pnpm turbo run build --filter=@repo/your-app`
- File paths and build commands for your app type

### 3. Create fly.toml

**Option A - Copy existing:**

```bash
# Copy from similar app type
cp devops/sfy-link-in-bio-app/fly.toml devops/your-app/fly.toml

# Then modify app name, ports, etc. and launch
fly launch --no-deploy -c devops/your-app/fly.toml
```

**Option B - Generate new:**

```bash
fly launch --no-deploy --name your-app --internal-port 3000 --dockerfile devops/your-app/Dockerfile
```

### 4. Set environment secrets

```bash
# Import from .env file
cat apps/your-app/.env.prod | fly secrets import < .env.local -a your-app

# Or set individual secrets
fly secrets set DATABASE_URL=postgres://... -a your-app
```

### 5. Add deployment commands

Add to root `package.json`:

```json
"docker:build:your-app": "docker build -f devops/your-app/Dockerfile -t saku-your-app .",
"fly:deploy:your-app": "fly deploy -c devops/your-app/fly.toml"
```

### 6. Deploy

```bash
pnpm fly:deploy:your-app
```

## 🔧 Troubleshooting

### Check deployment logs

```bash
# View live logs
fly logs -a your-app
```

## ❓ FAQ

### Why centralized DevOps over per-app configs?

- `turbo prune` needs full repo access
- Turborepo must run from root for proper workspace resolution

### Why run Docker commands from the monorepo root?

All Docker actions (`build`, `deploy`) run from root to:

1. Resolve dependencies with `turbo prune`
2. Provide full context via `COPY . .`
3. Access shared packages like `@repo/types` and `@repo/api-core`

## 💡 Resources / References

- [Dockerizing Turborepo Remix Application](https://medium.com/@joudwawad/dockerizing-turborepo-remix-application-fca679002c23)
