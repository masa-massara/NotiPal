# -----------------------------------------------------------------------------
# ベースイメージ
# -----------------------------------------------------------------------------
    FROM oven/bun:1-slim AS base
    WORKDIR /usr/src/app
    
    # -----------------------------------------------------------------------------
    # 依存関係のインストールステージ (権限修正とロックファイル生成実験)
    # -----------------------------------------------------------------------------
    FROM base AS deps
    
    COPY apps/backend/package.json ./package.json
    # COPY bun.lock ./bun.lock  # ★★★ ロックファイルはまだコピーしない ★★★
    
    USER root
    RUN apt-get update && \
        apt-get install -y git diffutils --no-install-recommends && \
        rm -rf /var/lib/apt/lists/* && \
        chown -R bun:bun /usr/src/app # ★★★ WORKDIRの所有者をbunユーザーに変更 ★★★
    
    USER bun
    
    RUN echo "Attempting 'bun install --production' WITHOUT any pre-existing bun.lock..." && \
        bun install --production && \
        echo "Finished 'bun install --production'. If successful, a new bun.lock should have been generated." && \
        echo "Listing files in current directory to check for bun.lock:" && \
        ls -la && \
        echo "Content of new bun.lock (if created and not too large):" && \
        (test -f bun.lock && head -n 50 bun.lock || echo "bun.lock not found or head command failed.") && \
        (test -f bun.lock && echo "bun.lock was created." || echo "bun.lock was NOT created.")
    
    # この後、もし上のステップで bun.lock が生成されていれば、
    # それを使って --frozen-lockfile で再度インストールを試みる
    RUN echo "Now attempting 'bun install --frozen-lockfile --production' using the potentially generated bun.lock..." && \
        bun install --frozen-lockfile --production
    # -----------------------------------------------------------------------------
    # (ビルドステージはコメントアウトのまま)
    # -----------------------------------------------------------------------------
    
    # -----------------------------------------------------------------------------
    # 最終的な実行ステージ
    # -----------------------------------------------------------------------------
    FROM base
    
    ENV NODE_ENV=production
    EXPOSE 8080
    
    COPY --from=deps /usr/src/app/node_modules ./node_modules
    COPY --from=deps /usr/src/app/bun.lock ./bun.lock
    
    COPY apps/backend/src ./src
    # もし `apps/backend` 直下に `tsconfig.json` など、実行時に必要な設定ファイルがあるなら、それもコピーするんや。
    # 例: COPY apps/backend/tsconfig.json ./tsconfig.json
    
    CMD ["bun", "run", "start"]
