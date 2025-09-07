FROM node:18-alpine

# Install system dependencies
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install pnpm and tools globally
RUN corepack enable pnpm

# Copy root package files first (for better caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY *.config.* ./

# Copy all apps and packages (needed for monorepo)
COPY apps ./apps
COPY packages ./packages

# Install all dependencies
RUN pnpm install

# Stay in root directory (for turbo commands)
WORKDIR /app

# Expose web port
EXPOSE 3001

# Run only the web app
CMD ["pnpm", "run", "dev", "--filter=web"]
