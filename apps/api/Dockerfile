FROM node:18-alpine

# Install system dependencies
RUN apk update && apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install pnpm and tools globally
RUN corepack enable pnpm
RUN npm install -g turbo@latest @nestjs/cli

# Copy all root config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY *.config.* ./

# Copy all apps and packages
COPY apps ./apps
COPY packages ./packages

# Install all dependencies
RUN pnpm install

# Stay in root directory
WORKDIR /app

# Expose port
EXPOSE 3000

# Run dev from root
CMD ["pnpm", "run", "dev"]
