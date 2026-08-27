# ==========================================
# STAGE 1: Build & Dependencies
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy full application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# ==========================================
# STAGE 2: Production Runtime
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --only=production

# Copy generated Prisma client and source files from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/views ./views
COPY --from=builder /app/resources ./resources
COPY --from=builder /app/src ./src

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "src/app.js"]
