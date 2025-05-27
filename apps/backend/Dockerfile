# ステージ1: ビルド環境 (もしビルドが必要なら)
# FROM oven/bun:latest as build
# WORKDIR /usr/src/app
# COPY package.json bun.lockb ./
# RUN bun install --frozen-lockfile
# COPY . .
# RUN bun run build # もしビルドスクリプトがあるなら

# ステージ2: 本番環境
FROM oven/bun:1-slim

WORKDIR /usr/src/app

# 依存関係のみを先にコピーしてインストール (キャッシュ効率化のため)
COPY package.json bun.lockb ./
# 本番に必要な依存関係のみインストール (もし devDependencies が多い場合)
RUN bun install --frozen-lockfile --production

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションがリッスンするポート (Cloud Run はデフォルト8080)
EXPOSE 8080

# アプリケーションの起動コマンド (package.json の start スクリプト)
CMD ["bun", "run", "start"]
