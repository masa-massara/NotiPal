FROM oven/bun:1-slim AS base
WORKDIR /usr/src/app

# 1. ルートの package.json と bun.lockb をコピー
COPY package.json bun.lock ./

# 2. ワークスペース内の各アプリケーションの package.json を、
#    それぞれのディレクトリ構造を維持してコピーする。
#    (今回はバックエンドのDockerfileやけど、ロックファイルの整合性のために
#     フロントエンドの package.json も必要になることがあるで)
COPY apps/backend/package.json ./apps/backend/
# もし apps/frontend/package.json もロックファイルの整合性に関わるなら、同様にコピー
# COPY apps/frontend/package.json ./apps/frontend/
# 他にも apps/????/package.json があれば同様に

# 3. 依存関係をインストール
#    ワークスペース内の全ての package.json とルートの bun.lock が揃った状態で実行
RUN bun install --frozen-lockfile --production

# 4. アプリケーションのコード全体をコピー
COPY . .

# 5. 実行コマンド (これはあんたのアプリに合わせてな)
CMD ["bun", "run", "dev"] # package.jsonのscriptsのdevで起動する場合
