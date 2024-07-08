FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS ci
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
COPY package-lock.json ./
RUN  npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=ci /app/node_modules/ ./node_modules/
#COPY . .
COPY package*.json ./
COPY tsconfig.json .
COPY tsconfig.server.json .
COPY next.config.js .
COPY src/ src/
COPY public/ public/
COPY auth.ts .
ENV NODE_ENV production
RUN npm run build

# Production image, copy all the files and run the server
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/dist .
COPY --from=ci /app/node_modules/ ./node_modules/

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

#RUN mkdir data
#RUN chown nextjs:nodejs data

# Set the correct permission for prerender cache
#RUN mkdir .next
RUN chown nextjs:nodejs .next
RUN chown nextjs:nodejs .next/types/app/

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

RUN echo test
ENTRYPOINT [ "node" ]
CMD ["src/server.js"]