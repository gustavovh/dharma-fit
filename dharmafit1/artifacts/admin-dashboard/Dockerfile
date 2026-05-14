FROM node:20-alpine

WORKDIR /app

# Copy monorepo files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Copy workspaces
COPY lib ./lib
COPY artifacts/admin-dashboard ./artifacts/admin-dashboard

# Install pnpm
RUN npm install -g pnpm@9

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Expose port
EXPOSE 3000

# Start the admin dashboard
CMD ["pnpm", "-F", "@workspace/admin-dashboard", "dev", "--hostname", "0.0.0.0", "--port", "3000"]
