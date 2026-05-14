FROM node:20-alpine

WORKDIR /app

# Copy monorepo files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Copy workspaces
COPY lib ./lib
COPY artifacts/api-server ./artifacts/api-server

# Install pnpm
RUN npm install -g pnpm@9

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Expose port
EXPOSE 3001

# Start the API server
CMD ["pnpm", "-F", "@workspace/api-server", "start"]
