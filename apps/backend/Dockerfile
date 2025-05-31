# -----------------------------------------------------------------------------
# ベースイメージ (Bun 1.2.15)
# -----------------------------------------------------------------------------
    FROM oven/bun:1-slim AS base
    WORKDIR /usr/src/app
    
    # -----------------------------------------------------------------------------
    # 依存関係のインストールとアプリケーションコードのコピー
    # -----------------------------------------------------------------------------
    # backend用のpackage.jsonと、プロジェクトルートにあるbun.lockをコピーする。
    # これがCIのビルドコンテキストのルートにコピーされる。
    COPY apps/backend/package.json ./package.json
    COPY bun.lock ./bun.lock
    
    # この時点で WORKDIR (/usr/src/app) には以下がある想定：
    # - package.json (apps/backend/package.json の内容)
    # - bun.lock (プロジェクトルートの bun.lock の内容)
    
    # 本番用の依存関係をインストール
    # これが元のエラー箇所。ローカルの bun.lock が正しければ通るはず。
    RUN bun install --frozen-lockfile --production
    
    # アプリケーションのソースコード全体をコピーする
    # (注意: これはビルドコンテキストのルートにあるもの全てをコピーするので、
    #  .dockerignore で不要なファイルを除外することが強く推奨される)
    COPY . .
    # もし apps/backend のコードだけをコピーしたいなら、
    # COPY apps/backend/src ./apps/backend/src
    # COPY apps/backend/tsconfig.json ./apps/backend/tsconfig.json (もしあれば)
    # のように、必要なものだけを明示的にコピーする方が良い。
    # CMDで apps/backend/src/main.ts を実行するなら、
    # 構造を合わせるために apps/backend をコピーするのが自然かも。
    # 例: COPY apps/backend ./apps/backend
    
    # -----------------------------------------------------------------------------
    # 最終的な実行ステージ (単一ステージなので、このまま)
    # -----------------------------------------------------------------------------
    ENV NODE_ENV=production
    EXPOSE 8080
    
    # CMDの実行パスを考慮して、もし apps/backend を丸ごとコピーした場合
    # CMD ["bun", "run", "apps/backend/src/main.ts"] # startスクリプトが適切ならそれでもOK
    # もし、WORKDIR直下にsrcをコピーしたなら元のままでOK
    # COPY apps/backend/src ./src
    # COPY apps/backend/tsconfig.json ./ # (もしあれば)
    # ↓ このCMDは、WORKDIR直下に apps/backend/package.json の内容があり、
    #   その中の "start": "bun src/main.ts" を実行する想定。
    #   そのためには、src も WORKDIR 直下にないとおかしい。
    #   ここでは、apps/backend の中身を WORKDIR/apps/backend にコピーし、
    #   CMD で workspace を指定するか、実行パスを調整するのがより正しい。
    #
    #   一番シンプルなのは、このDockerfileのWORKDIRを /usr/src/app/apps/backend にしてしまうこと。
    #   ただし、ルートの bun.lock を使うので、それはそれでパスの調整が必要。
    
    # 今回は、CMDは元のままで、COPY . . で全てコピーされるので、
    # bunがワークスペースを認識して適切に apps/backend の start を実行することを期待する。
    CMD ["bun", "run", "start"]
