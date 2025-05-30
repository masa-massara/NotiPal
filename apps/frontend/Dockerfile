# ステージ1: 依存関係のインストールとビルド
FROM oven/bun:1 as builder
WORKDIR /usr/src/app

# アプリケーションのビルド時に使用する環境変数
# これらの値は docker build コマンドの --build-arg で渡される
ARG NEXT_PUBLIC_FIREBASE_API_KEY_PROD
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD
ARG NEXT_PUBLIC_FIREBASE_APP_ID_PROD
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD
ARG NEXT_PUBLIC_API_BASE_URL_PROD

# ビルド時にARGからENVへ設定
ENV NEXT_PUBLIC_FIREBASE_API_KEY_PROD=$NEXT_PUBLIC_FIREBASE_API_KEY_PROD
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD=$NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD
ENV NEXT_PUBLIC_FIREBASE_APP_ID_PROD=$NEXT_PUBLIC_FIREBASE_APP_ID_PROD
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD
ENV NEXT_PUBLIC_API_BASE_URL_PROD=$NEXT_PUBLIC_API_BASE_URL_PROD

# ビルドステージでは開発依存も必要なので、NODE_ENV はここでは設定しないか、
# ビルド直前に設定する方が安全な場合があります。
# ただし、Next.js のビルドは 'production' で行われるのが一般的なので、
# bun install 後、bun run build の前に設定するのが良いかもしれません。
# ENV NODE_ENV=production # ここか、RUN bun run build の直前

# --- モノレポ対応 ---
# 依存関係解決に必要なファイルを先にコピー
COPY package.json bun.lock turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
# COPY bunfig.toml ./ # もしルートにあれば

# ワークスペース全体の依存関係をインストール
# これで node_modules/.bin/turbo も作成されるはず
RUN bun install --frozen-lockfile

# アプリケーションのソースコード全体をコピー
# ( .dockerignore で不要なファイルを除外することを推奨 )
COPY . .
# COPY apps ./apps # こちらのほうがより限定的で良い場合も
# COPY tsconfig.json ./ # ルートのtsconfigも必要なら

# Next.js アプリケーションをビルド (turbo を使って frontend のみを対象に)
ENV NODE_ENV=production
RUN bun run build
# 確認用: RUN ls -R /usr/src/app/apps/frontend/.next/standalone

# ステージ2: プロダクションイメージの作成
FROM oven/bun:1 as production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# NEXT_PUBLIC_* の環境変数は、Cloud Runのサービス実行時に設定するため、ここでは不要

# builderステージの standalone 出力全体を /app にコピー
# これにより、server.js、必要なnode_modules、.next、publicなどが /app 直下に配置される
COPY --from=builder /usr/src/app/apps/frontend/.next/standalone ./

# 念のため、publicと.next/staticがstandaloneに含まれていない場合に備える
# (通常、Next.js v12以降のstandalone出力ではこれらはstandalone内に適切に配置されるはず)
# もし、ls -R の結果、これらが /usr/src/app/apps/frontend/ (.next/standaloneの外) にある場合は、
# 以下のようなコピーが必要になる。
# COPY --from=builder /usr/src/app/apps/frontend/public ./public
# COPY --from=builder /usr/src/app/apps/frontend/.next/static ./.next/static


EXPOSE 3000

# server.js はコピーされた /app の直下にあると想定して実行
CMD ["bun", "server.js"]
