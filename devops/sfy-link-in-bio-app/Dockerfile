# syntax=docker/dockerfile:1

# =============================================================================
# Multi-stage Docker build for React Router app in Turborepo monorepo
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

LABEL fly_launch_runtime="React Router"

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

# Set environment identifier (e.g. for vite.config.ts)
ENV DOCKER=1

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

# Build-time args for Vite environment variables
ARG VITE_API_CORE_URL
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
ARG VITE_MANTLE_APP_ID
ARG VITE_CRISP_TOKEN

# Validate required build args
RUN test -n "$VITE_API_CORE_URL" || (echo "VITE_API_CORE_URL build arg is required" && false)
RUN test -n "$VITE_POSTHOG_KEY" || (echo "VITE_POSTHOG_KEY build arg is required" && false)
RUN test -n "$VITE_POSTHOG_HOST" || (echo "VITE_POSTHOG_HOST build arg is required" && false)
RUN test -n "$VITE_MANTLE_APP_ID" || (echo "VITE_MANTLE_APP_ID build arg is required" && false)
RUN test -n "$VITE_CRISP_TOKEN" || (echo "VITE_CRISP_TOKEN build arg is required" && false)

# Set as system environment variables for the build
ENV VITE_API_CORE_URL=$VITE_API_CORE_URL \
    VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY \
    VITE_POSTHOG_HOST=$VITE_POSTHOG_HOST \
    VITE_MANTLE_APP_ID=$VITE_MANTLE_APP_ID \
    VITE_CRISP_TOKEN=$VITE_CRISP_TOKEN

WORKDIR /app

# Copy package.json and install dependencies
COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code and build the project
COPY --from=pruner /app/out/full/ .

# Build the project with Turbo in loose mode
# Using --env-mode=loose because:
# 1. We set our VITE_* variables as container ENV vars above
# 2. By default (strict mode), Turbo blocks these container ENV vars from reaching the build
# 3. Loose mode allows our container ENV vars to pass through to Vite during build
# See: https://turbo.build/repo/docs/reference/configuration#env
RUN pnpm turbo run build --filter=@repo/sfy-link-in-bio-app --env-mode=loose

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
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home react-router

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy built application and runtime files
COPY --from=builder --chown=react-router:nodejs /app/apps/sfy-link-in-bio/app/build ./build
COPY --from=builder --chown=react-router:nodejs /app/apps/sfy-link-in-bio/app/package.json ./package.json
COPY --from=builder --chown=react-router:nodejs /app/apps/sfy-link-in-bio/app/public ./public
COPY --from=builder --chown=react-router:nodejs /app/node_modules ./node_modules

USER react-router
EXPOSE 3000

CMD ["npm", "run", "start"]
