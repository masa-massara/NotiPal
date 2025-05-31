# oven/bun イメージを指定 (ログに合わせてバージョンを正確に指定するのもええかも)
# 例: FROM oven/bun:1.2.15-slim (もしあれば)
# ただ、:1-slim で Bun 1.2.15 が入ってるのはログからわかっとる
FROM oven/bun:1-slim AS base
WORKDIR /usr/src/app

# 1. ルートの package.json と bun.lockb をコピー
# これらはワークスペース全体の定義とロックファイルや
COPY package.json bun.lock ./

# 2. ワークスペース内の各アプリケーションの package.json を、
#    それぞれのディレクトリ構造を維持してコピーする。
#    これが不足してると、bun.lockb との整合性エラーが起きやすいで。
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

# もし他にも apps/xxx/package.json のような構成でパッケージがあるなら、
# それらも同様にコピーする必要があるかもしれん。
# 例: COPY apps/common/package.json ./apps/common/package.json

# 3. 依存関係をインストール
#    ワークスペース内の全ての package.json とルートの bun.lockb が揃った状態で実行
RUN bun install --frozen-lockfile --production --ignore-scripts

# 4. アプリケーションのコード全体をコピー
#    依存関係インストール後にコード全体をコピーするのが一般的や。
#    こうすることで、コード変更だけの場合、上記のレイヤーはキャッシュが効いてビルドが速くなる。
COPY . .

# 5. 実行コマンド (これは既存のものを流用)
#    あんたの backend/package.json の "dev" スクリプトで起動する形やな
CMD ["bun", "run", "dev"]
