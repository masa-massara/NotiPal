# ステージ1: 依存関係のインストールとビルド
FROM oven/bun:1 as builder
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0" 

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

# --- モノレポ対応 ---
# ルートの package.json, bun.lock, turbo.json などをコピー
COPY package.json bun.lock turbo.json ./
# frontend ワークスペースの package.json をコピー
COPY apps/frontend/package.json ./apps/frontend/
# backend ワークスペースの package.json もコピー (turbo が依存関係を解決するために必要になることがある)
COPY apps/backend/package.json ./apps/backend/
# bunfig.toml もあればコピー (ルートの bunfig.toml を参照)
COPY bunfig.toml ./


# ワークスペース全体の依存関係をインストール
# --frozen-lockfile は bun.lock に基づいて厳密にインストールするオプションや
RUN bun install --frozen-lockfile
RUN bun install -g turbo

# アプリケーションのソースコード全体をコピー
# この時点では /usr/src/app が作業ディレクトリやから、リポジトリルートからの相対パスで指定する
COPY apps ./apps
COPY .github ./.github


# Next.js アプリケーションをビルド (turbo を使って frontend のみを対象に)
# turbo.json の "build" タスクが "apps/frontend/.next/**" などを出力するように設定されてるはずや
RUN turbo run build

# ステージ2: プロダクションイメージの作成
FROM oven/bun:1 as production
WORKDIR /usr/src/app


# NEXT_PUBLIC_ で始まる本番用の環境変数は、Cloud Run サービスで設定することを推奨するで

# ビルドステージから、ビルド済みの Next.js アプリ (standalone 形式) をコピー
# Next.js の `output: 'standalone'` 設定により、.next/standalone に実行に必要なファイルがまとまるんや
COPY --from=builder /usr/src/app/apps/frontend/.next/standalone ./apps/frontend/
# 静的ファイルも忘れずにコピー
COPY --from=builder /usr/src/app/apps/frontend/.next/static ./apps/frontend/.next/static
# public フォルダも必要ならコピー
COPY --from=builder /usr/src/app/apps/frontend/public ./apps/frontend/public

ENV NODE_ENV=production

RUN mkdir -p ./apps/frontend/node_modules/next/dist/compiled/
COPY --from=builder /usr/src/app/node_modules/next/dist/compiled/@opentelemetry/api ./apps/frontend/node_modules/next/dist/compiled/@opentelemetry/api

# 念のため、tracer.js が直接参照しそうな他のパスにもコピーしてみる
# (これは冗長かもしれんが、問題切り分けのため)
RUN mkdir -p ./apps/frontend/next/dist/compiled/
COPY --from=builder /usr/src/app/node_modules/next/dist/compiled/@opentelemetry/api ./apps/frontend/next/dist/compiled/@opentelemetry/api

# 起動ポート (Next.js のデフォルトは3000やけど、環境変数 PORT で変更可能)
EXPOSE 3000

# アプリケーションを起動
# .next/standalone ディレクトリの中にある server.js を bun で実行する
# 作業ディレクトリは /usr/src/app のままなので、パスの指定に注意や
CMD ["bun", "apps/frontend/server.js"]
