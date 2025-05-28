import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	outputFileTracingIncludes: {
		"node_modules/@opentelemetry/api": [
			"./node_modules/@opentelemetry/api/**/*",
		],
	},
};

export default nextConfig;
