# oven/bun イメージを指定 (ログに合わせてバージョンを正確に指定するのもええかも)
# 例: FROM oven/bun:1.2.15-slim (もしあれば)
# ただ、:1-slim で Bun 1.2.15 が入ってるのはログからわかっとる
FROM oven/bun:1-slim AS base
WORKDIR /usr/src/app

# 1. ルートと各ワークスペースの package.json をコピー
COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/common/package.json ./packages/common/

# 2. 依存関係をインストール
#    --production をつけると devDependencies が入らないので、
#    もしビルド時に TypeScript などが必要な場合は外す必要がある。
#    今回は bun で直接 ts を実行するので、devDependencies も含める。
RUN bun install --frozen-lockfile --ignore-scripts

# 3. アプリケーションのソースコードをコピー
#    ビルドに必要なファイルのみをコピーするのがベストプラクティス。
COPY apps/backend/src ./apps/backend/src
COPY packages/common/src ./packages/common/src

# 5. 実行コマンド (これは既存のものを流用)
#    あんたの backend/package.json の "dev" スクリプトで起動する形やな
CMD ["bun", "apps/backend/src/main.ts"]
