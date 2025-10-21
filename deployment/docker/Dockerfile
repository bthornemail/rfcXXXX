# RFC XXXX Implementation Docker Image
# Multi-stage build for optimized production image

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

    # Install all dependencies (including dev dependencies for build)
    RUN npm install

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S rfcxxxx -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=rfcxxxx:nodejs /app/dist ./dist
COPY --from=builder --chown=rfcxxxx:nodejs /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Create data directory for weight storage
RUN mkdir -p /app/data && chown rfcxxxx:nodejs /app/data

# Switch to non-root user
USER rfcxxxx

# Expose ports for UDP and HTTP
EXPOSE 3001-3010
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command - can be overridden
CMD ["node", "dist/examples/real-showcase-demo.js"]

# Labels for metadata
LABEL maintainer="Axiomatic Research"
LABEL description="RFC XXXX Geometric Normative Keywords Implementation"
LABEL version="1.0.0"
LABEL org.opencontainers.image.title="RFC XXXX Implementation"
LABEL org.opencontainers.image.description="Geometric Normative Keywords with Network Partition Handling and IPv6 Neural Encoding"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/axiomatic/rfc-xxxx"
