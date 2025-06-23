# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.14.0
ARG PNPM_VERSION=10.12.1

# =============================================================================
# BASE STAGE
# Foundation with Node.js, system dependencies, and pnpm
# =============================================================================
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Remix"

# Install system dependencies for native Node.js modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python-is-python3 \
    openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@$PNPM_VERSION

WORKDIR /app

# =============================================================================
# PRUNER STAGE
# Create minimal subset of monorepo for specific app using Turbo
# =============================================================================
FROM base AS pruner

RUN npm install -g turbo
COPY . .
RUN turbo prune @repo/sfy-link-in-bio-app --docker

# =============================================================================
# DEPENDENCIES STAGE
# Install all dependencies (including devDependencies) for building
# =============================================================================
FROM base AS deps

# Copy package files for Docker layer caching
COPY --from=pruner /app/out/json/ .

# Install with pnpm cache mount for faster rebuilds
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# =============================================================================
# PRODUCTION DEPENDENCIES STAGE
# Install only production dependencies for final runtime image
# =============================================================================
FROM base AS production-deps

COPY --from=pruner /app/out/json/ .
ENV NODE_ENV=production

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

# =============================================================================
# BUILDER STAGE
# Build the application using full dependencies
# =============================================================================
FROM base AS builder

ENV NODE_ENV=production

# Copy source code and build dependencies
COPY --from=pruner /app/out/full/ .
COPY --from=deps /app/node_modules ./node_modules

# Build the application
RUN pnpm turbo run build --filter=@repo/sfy-link-in-bio-app

# =============================================================================
# PRODUCTION STAGE
# Final minimal runtime image
# =============================================================================
FROM node:${NODE_VERSION}-slim AS production

WORKDIR /app

# Install minimal runtime dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@$PNPM_VERSION

# Create non-root user for security
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home remix

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy built application and production dependencies
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/build ./build
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/package.json ./package.json
COPY --from=builder --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/public ./public
COPY --from=production-deps --chown=remix:nodejs /app/node_modules ./node_modules

USER remix
EXPOSE 3000

CMD ["pnpm", "run", "start"]
