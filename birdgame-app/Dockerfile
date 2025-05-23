# from https://github.com/vercel/next.js/tree/canary/examples/with-docker

# Install dependencies only when needed
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
#FROM node:14-buster-slim as builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# RUN yarn build
ENV NEXT_TELEMETRY_DISABLED 1

# NODE_OPTIONS=--openssl-legacy-provider
# for Error: error:0308010C:digital envelope routines::unsupported
# could use another node version also
# Not needed with node 16
#
# NODE_OPTIONS=--max_old_space_size
# reduced RAM usage during build phase
#
RUN export NODE_OPTIONS=--max_old_space_size=1024 && yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000


CMD ["node", "server.js"]