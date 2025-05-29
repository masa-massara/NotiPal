import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	// experimental: { // ← experimental の中から外に出すんや！
	// 	outputFileTracingIncludes: { ... }
	// },
	outputFileTracingIncludes: {
		// ← ここにトップレベルで書く！
		// キーは、.next/server ディレクトリ内のファイルにマッチするglobパターンを指定する。
		// 今回は、サーバー側の全てのJSファイルに対して、特定のモジュールを含めるようにしてみる。
		".next/server/app/**/*.js": [
			"./node_modules/next/dist/compiled/@opentelemetry/api/**/*",
			// 依存関係でよく使われるものや、過去に不足しがちやったものも念のため追加
			"./node_modules/next/dist/compiled/semver/**/*",
			"./node_modules/next/dist/compiled/jest-worker/**/*",
			"./node_modules/next/dist/compiled/chalk/**/*", // ログ出力などで使われる
			"./node_modules/next/dist/compiled/source-map/**/*", // ソースマップ関連
			// "./node_modules/next/dist/compiled/react/**/*", // React自体も含まれることがある
			// "./node_modules/next/dist/compiled/react-dom/**/*",
		],
	},
	/* 他に元々設定があったら、それは残しといてな */
};

export default nextConfig;
