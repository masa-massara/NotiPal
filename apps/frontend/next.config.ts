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
		"**/*.js": [
			// 値は、プロジェクトのルートディレクトリからの相対パスで、含めたいファイル/ディレクトリを指定。
			"./node_modules/next/dist/compiled/@opentelemetry/api/**/*",
		],
	},
	/* 他に元々設定があったら、それは残しといてな */
};

export default nextConfig;
