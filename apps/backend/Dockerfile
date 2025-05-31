# -----------------------------------------------------------------------------
# ベースイメージ
# -----------------------------------------------------------------------------
FROM oven/bun:1-slim AS base

# アプリケーションのルートディレクトリをコンテナ内に作成
WORKDIR /usr/src/app

# -----------------------------------------------------------------------------
# 依存関係のインストールステージ (診断用変更あり)
# -----------------------------------------------------------------------------
FROM base AS deps

# backend用のpackage.jsonと、プロジェクトルートにあるbun.lockをコピーする。
COPY apps/backend/package.json ./package.json
COPY bun.lock ./bun.lock

# --- ここから診断用の変更 ---

# git と diffutils をインストール (ベースイメージに入ってない場合があるため)
# oven/bun:1-slim のデフォルトユーザーは bun なので、root権限で実行するために USER を切り替える
USER root
RUN apt-get update && \
apt-get install -y git diffutils --no-install-recommends && \
rm -rf /var/lib/apt/lists/*
USER bun

# 元のbun.lockをバックアップ
COPY bun.lock ./original-bun.lock

# --frozen-lockfile を一時的に外して、bunにbun.lockを更新させる
# これで、bun.lock がどう変わるかを確認する
RUN bun install --production

# 更新されたbun.lockと元のbun.lockの差分を表示する
# 差分があってもエラーで止まらないように || true をつけてる
RUN echo "--- Diff between original bun.lock and bun.lock after 'bun install --production' ---" && \
(git diff --no-index --color=always original-bun.lock bun.lock || true) && \
echo "--- End of diff ---"

# --- 診断用の変更ここまで ---

# 元々エラーが出ていたコマンドを再度実行する
# これで、上に出力された差分が「lockfile had changes」の具体的な内容になるはずや
RUN bun install --frozen-lockfile --production

# -----------------------------------------------------------------------------
# ビルドステージ (もし必要なら)
# (変更なし)
#
# FROM base AS builder
# WORKDIR /usr/src/app
# COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY apps/backend/ ./
# RUN bun run build
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# 最終的な実行ステージ
# -----------------------------------------------------------------------------
FROM base

ENV NODE_ENV=production
EXPOSE 8080

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY apps/backend/src ./src
# もし `apps/backend` 直下に `tsconfig.json` など、実行時に必要な設定ファイルがあるなら、それもコピーするんや。
# 例: COPY apps/backend/tsconfig.json ./tsconfig.json

CMD ["bun", "run", "start"]
