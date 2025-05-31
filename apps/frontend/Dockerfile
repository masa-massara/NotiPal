FROM oven/bun:1-slim as builder
WORKDIR /usr/src/app

ARG NEXT_PUBLIC_FIREBASE_API_KEY_PROD
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD
ARG NEXT_PUBLIC_FIREBASE_APP_ID_PROD
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD
ARG NEXT_PUBLIC_API_BASE_URL_PROD

ENV NEXT_PUBLIC_FIREBASE_API_KEY_PROD=$NEXT_PUBLIC_FIREBASE_API_KEY_PROD
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD=$NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD
ENV NEXT_PUBLIC_FIREBASE_APP_ID_PROD=$NEXT_PUBLIC_FIREBASE_APP_ID_PROD
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD
ENV NEXT_PUBLIC_API_BASE_URL_PROD=$NEXT_PUBLIC_API_BASE_URL_PROD

COPY package.json bun.lock turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
# COPY bunfig.toml ./ # もしルートにあれば

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
RUN bun run build


# ステージ2: プロダクションイメージの作成
FROM oven/bun:1 as production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /usr/src/app/apps/frontend/.next/standalone/apps/frontend/ ./
COPY --from=builder /usr/src/app/apps/frontend/.next/standalone/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/frontend/.next/standalone/package.json ./package.json

COPY --from=builder /usr/src/app/apps/frontend/.next/static ./.next/static
COPY --from=builder /usr/src/app/apps/frontend/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
