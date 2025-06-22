# DevOps

Centralized deployment and infrastructure configuration for the Saku monorepo.

## Why Centralized?

Monorepo issues solved:
- Docker build context needs full repo access for `turbo prune`
- Turborepo workspace resolution from root
- Shared infrastructure without duplication

## Structure

```
devops/
├── docker-compose.yml              # Local development
├── .env.local                     # Development environment
├── apps/
│   └── sfy-link-in-bio-app/
│       ├── Dockerfile
│       └── fly.toml
└── README.md
```

## Usage

### Local Development
```bash
# Start services
pnpm run docker:dev

# Stop services  
pnpm run docker:dev:down
```

### Production
```bash
# Build
pnpm run docker:build:sfy-link-in-bio

# Deploy to Fly.io
pnpm run fly:deploy:sfy-link-in-bio
```

### Environment Variables

**Local**: Copy `devops/.env.template` to `devops/.env.local` and fill in your values

**Production**: Use Fly.io secrets
```bash
fly secrets import < apps/sfy-link-in-bio-app/app/.env.prod -a your-app-name
```

## Adding Apps

1. Create `devops/apps/your-app/` with `Dockerfile` and `fly.toml`
2. Add service to `docker-compose.yml`
3. Add scripts to root `package.json` 