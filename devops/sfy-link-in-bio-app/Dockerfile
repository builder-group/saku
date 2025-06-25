# syntax=docker/dockerfile:1

# =============================================================================
# Multi-stage Docker build for Remix app in Turborepo monorepo
# Based on official Turborepo Docker guide:
# https://turborepo.com/docs/guides/tools/docker
# =============================================================================

ARG NODE_VERSION=20.14.0
ARG PNPM_VERSION=10.12.1

# =============================================================================
# BASE STAGE
# Foundation with Node.js and pnpm
# =============================================================================
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Remix"

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python-is-python3 \
    openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm and turbo
RUN npm install -g pnpm@$PNPM_VERSION turbo

WORKDIR /app

# =============================================================================
# PRUNER STAGE
# Generate pruned monorepo for the target workspace
# =============================================================================
FROM base AS pruner

# Copy entire monorepo
COPY . .

# Generate a partial monorepo with a pruned lockfile for target workspace
RUN turbo prune @repo/sfy-link-in-bio-app --docker

# =============================================================================
# BUILDER STAGE
# Install dependencies and build the application
# =============================================================================
FROM base AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code and build the project
COPY --from=pruner /app/out/full/ .

# Remove any .env files that might override environment variables from build args
RUN find . -name ".env*" -type f -delete

# Build arguments for Vite environment variables
ARG VITE_CLIENT_API_CORE_URL

# Write build args to .env file for Vite to read
# Vite didn't pick up environment variables set via ENV, so we use .env file as workaround
# https://vite.dev/guide/env-and-mode#env-variables
RUN set -e; \
    echo "VITE_CLIENT_API_CORE_URL=$VITE_CLIENT_API_CORE_URL" > apps/sfy-link-in-bio/app/.env

# Build the project
RUN pnpm turbo run build --filter=@repo/sfy-link-in-bio-app

# =============================================================================
# RUNTIME STAGE
# Final minimal runtime image
# =============================================================================
FROM node:${NODE_VERSION}-slim AS runtime

WORKDIR /app

# Install minimal runtime dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home remix

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy built application and runtime files
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio/app/build ./build
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio/app/package.json ./package.json
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio/app/public ./public
COPY --from=builder --chown=remix:nodejs /app/node_modules ./node_modules

USER remix
EXPOSE 3000

CMD ["npm", "run", "start"]
