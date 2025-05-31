# -----------------------------------------------------------------------------
# ベースイメージ
# -----------------------------------------------------------------------------
# エラーログに出てきた oven/bun:1-slim を使うで
FROM oven/bun:1-slim AS base

# アプリケーションのルートディレクトリをコンテナ内に作成
WORKDIR /usr/src/app

# -----------------------------------------------------------------------------
# 依存関係のインストールステージ
# Dockerのレイヤーキャッシュを有効活用するために、依存関係のインストールを
# ソースコードのコピーとは別のステージで行うのが一般的や。
# -----------------------------------------------------------------------------
FROM base AS deps

# backend用のpackage.jsonと、プロジェクトルートにあるbun.lockbをコピーする。
# ビルドコンテキストがプロジェクトルートになったから、それぞれのファイルパスを明示するんや。
COPY apps/backend/package.json ./package.json
COPY bun.lockb ./bun.lockb

# 依存関係をインストールする。
# '--production' をつけると、devDependenciesを除いた本番用の依存関係だけが入る。
# '--frozen-lockfile' をつけると、bun.lockb が変更されへんようになるから、CI環境では推奨や。
RUN bun install --frozen-lockfile --production

# -----------------------------------------------------------------------------
# ビルドステージ (もし必要なら)
# Hono (Bun) の場合、TypeScriptを直接実行できるから、
# フロントエンドのNext.jsみたいに明示的なビルドステップが不要なことも多い。
# もし `bun run build` みたいなビルドスクリプトを定義しとるなら、
# このステージで実行するんや。
#
# FROM base AS builder
# WORKDIR /usr/src/app
# COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY apps/backend/ ./ # backendの全ファイルをコピー (tsconfig.jsonなども含む)
# RUN bun run build  # もしビルドスクリプトがあるなら実行
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# 最終的な実行ステージ
# -----------------------------------------------------------------------------
FROM base

# 環境変数を設定 (例: 本番環境を指定)
ENV NODE_ENV=production

# ポートを指定 (Cloud Runやdocker-compose.ymlで指定するポートと合わせるんやで)
# apps/backend/docker-compose.yml や apps/backend/src/main.ts を見ると8080が使われとるみたいやな
EXPOSE 8080

# 依存関係インストールステージから、インストール済みのnode_modulesをコピー
COPY --from=deps /usr/src/app/node_modules ./node_modules

# backendのアプリケーションコードをコピー
# package.json と bun.lockb はdepsステージでコピー済みやから、
# ここでは主に `src` ディレクトリや、その他実行に必要なファイルをコピーする。
COPY apps/backend/src ./src
# もし `apps/backend` 直下に `tsconfig.json` など、実行時に必要な設定ファイルがあるなら、それもコピーするんや。
# 例: COPY apps/backend/tsconfig.json ./tsconfig.json

# アプリケーションの起動コマンド
# apps/backend/package.json の "scripts" に "start" があると仮定しとる。
# 例: "start": "bun src/main.ts"
# もし直接ファイルを指定するなら CMD ["bun", "src/main.ts"] のようになるで。
CMD ["bun", "run", "start"]
