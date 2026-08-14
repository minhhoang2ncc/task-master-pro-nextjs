# syntax=docker/dockerfile:1

# ─── Stage 1: Base ────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable


# ─── Stage 2: Install Dependencies ───────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json            apps/web/
COPY packages/types/package.json      packages/types/
COPY packages/ui/package.json         packages/ui/
COPY packages/utils/package.json      packages/utils/

RUN npm ci


# ─── Stage 3: Build ──────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY --from=deps /app/apps/ ./apps/

COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

ENV NEXT_TELEMETRY_DISABLED=1
ENV SERWIST_SUPPRESS_TURBOPACK_WARNING=1

RUN cd apps/web && npx next build --webpack


# ─── Stage 4: Production Runner ──────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Set to false only when running locally over plain HTTP.
ENV SECURE_COOKIES=true

RUN addgroup --system --gid 1001 nodejs \
  && adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static     ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public           ./apps/web/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/web/server.js"]
