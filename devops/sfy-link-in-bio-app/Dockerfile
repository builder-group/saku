# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Remix"

# Install pnpm globally
ARG PNPM_VERSION=10.12.1
RUN npm install -g pnpm@$PNPM_VERSION

FROM base AS pruner
# Install turbo globally in pruner stage
RUN npm install -g turbo

WORKDIR /app
COPY . .

# Generate a partial monorepo with a pruned lockfile for the target workspace
RUN turbo prune @repo/sfy-link-in-bio-app --docker

FROM base AS installer
# Install packages needed to build node modules
RUN apt-get update -qq && apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@repo/sfy-link-in-bio-app

# Remove dev dependencies and source files to reduce image size
RUN pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

# Final stage for app image
FROM base AS runner
WORKDIR /app

# Don't run production as root (security best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix
USER remix

# Copy built application from installer stage
COPY --from=installer --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/build ./build
COPY --from=installer --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/package.json ./package.json
COPY --from=installer --chown=remix:nodejs /app/apps/sfy-link-in-bio-app/app/public ./public

# Copy only production node_modules for the final image
COPY --from=installer --chown=remix:nodejs /app/node_modules ./node_modules

# Set environment
ENV NODE_ENV="production"

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
