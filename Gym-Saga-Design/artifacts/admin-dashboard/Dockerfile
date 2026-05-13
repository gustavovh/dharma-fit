FROM node:20-alpine

WORKDIR /app

# Copy monorepo files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspaces
COPY lib ./lib
COPY artifacts/admin-dashboard ./artifacts/admin-dashboard

# Install pnpm
RUN npm install -g pnpm@9

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build Next.js
RUN pnpm -F @workspace/admin-dashboard run build

# Expose port
EXPOSE 3000

# Start the admin dashboard
CMD ["pnpm", "-F", "@workspace/admin-dashboard", "start"]
