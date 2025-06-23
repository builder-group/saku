# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Remix"

# Install system dependencies needed for node modules
RUN apt-get update -qq
RUN apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 openssl
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

# Install pnpm globally
ARG PNPM_VERSION=10.12.1
RUN npm install -g pnpm@$PNPM_VERSION

# Pruner stage - creates a clean subset of the monorepo
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune @repo/sfy-link-in-bio-app --docker

# Dependencies stage - installs all dependencies
FROM base AS deps
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Production dependencies stage - only production dependencies
FROM base AS production-deps
WORKDIR /app
COPY --from=pruner /app/out/json/ .
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod

# Builder stage - builds the application
FROM base AS builder
WORKDIR /app
ENV NODE_ENV=production

# Copy the full source and dependencies
COPY --from=pruner /app/out/full/ .
COPY --from=deps /app/node_modules ./node_modules

# Build the application
RUN pnpm turbo run build --filter=@repo/sfy-link-in-bio-app

# Runner stage - final production image
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

# Install runtime dependencies
RUN apt-get update -qq
RUN apt-get install --no-install-recommends -y openssl
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

# Install pnpm in runner
ARG PNPM_VERSION=10.12.1
RUN npm install -g pnpm@$PNPM_VERSION

# Create non-root user
RUN groupadd --gid 1001 nodejs
RUN useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home remix

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy built application
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/build ./build
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/package.json ./package.json
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/public ./public

# Copy production dependencies
COPY --from=production-deps --chown=remix:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER remix

EXPOSE 3000

CMD ["pnpm", "run", "start"]
