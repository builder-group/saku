# syntax = docker/dockerfile:1

# Build argument to specify which app to build
ARG PROJECT

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Remix"

# Set production environment
ENV NODE_ENV="production"

# Install pnpm globally
ARG PNPM_VERSION=10.12.1
RUN npm install -g pnpm@$PNPM_VERSION

FROM base AS pruner
# Repass the PROJECT argument for this stage
ARG PROJECT

# Install turbo globally in pruner stage
RUN npm install -g turbo

WORKDIR /app
COPY . .

# Generate a partial monorepo with a pruned lockfile for the target workspace
RUN turbo prune ${PROJECT} --docker

FROM base AS installer
# Repass the PROJECT argument for this stage
ARG PROJECT

# Install packages needed to build node modules
RUN apt-get update -qq && apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=${PROJECT}

# Final stage for app image
FROM base AS runner
WORKDIR /app

# Copy built application from installer stage
COPY --from=installer /app/apps/sfy-link-in-bio-app/app/build ./build
COPY --from=installer /app/apps/sfy-link-in-bio-app/app/package.json ./package.json
COPY --from=installer /app/apps/sfy-link-in-bio-app/app/public ./public

# Copy only production node_modules for the final image
COPY --from=installer /app/node_modules ./node_modules

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
