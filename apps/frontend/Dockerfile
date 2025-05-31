# ステージ1: 依存関係のインストールとビルド
FROM oven/bun:1 as builder
WORKDIR /usr/src/app

# (ARGとENVの設定は元のままフルで記述)
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

# (デバッグ用lsコマンドは、ビルド成功後はコメントアウトまたは削除)
# RUN echo "--- [Builder Stage] Full listing of /usr/src/app/apps/frontend/.next/standalone ---"
# RUN ls -R /usr/src/app/apps/frontend/.next/standalone
# RUN echo "--- [Builder Stage] Full listing of /usr/src/app/apps/frontend/.next/standalone/apps/frontend ---"
# RUN ls -R /usr/src/app/apps/frontend/.next/standalone/apps/frontend


# ステージ2: プロダクションイメージの作成
FROM oven/bun:1 as production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# builderステージの /usr/src/app/apps/frontend/.next/standalone/apps/frontend ディレクトリの "中身" 全てを
# production ステージの WORKDIR (/app) にコピーします。
# これにより、server.js, .next (staticを含む可能性あり), public (存在するなら) などが /app 以下に配置される。
COPY --from=builder /usr/src/app/apps/frontend/.next/standalone/apps/frontend/ ./

# standaloneビルドによって収集されたnode_modulesをコピー
COPY --from=builder /usr/src/app/apps/frontend/.next/standalone/node_modules ./node_modules

# standaloneビルドによって収集されたpackage.jsonをコピー
COPY --from=builder /usr/src/app/apps/frontend/.next/standalone/package.json ./package.json

# ★★★ 以下の2行の明示的なCOPYは不要になるはず (最初のCOPYで含まれるため) ★★★
# COPY --from=builder /usr/src/app/apps/frontend/.next/standalone/public ./public
# COPY --from=builder /usr/src/app/apps/frontend/.next/standalone/.next/static ./.next/static

# (デバッグ用lsコマンドは、ビルド成功後はコメントアウトまたは削除)
# RUN echo "--- [Production Stage] Full listing of /app ---" && ls -R /app
# RUN echo "--- [Production Stage] Listing /app/.next/static ---" && ls -R /app/.next/static || echo "/app/.next/static not found"
# RUN echo "--- [Production Stage] Listing /app/public ---" && ls -R /app/public || echo "/app/public not found"


EXPOSE 3000

# WORKDIR が /app なので、server.js はカレントディレクトリにあるはず
CMD ["node", "server.js"]
