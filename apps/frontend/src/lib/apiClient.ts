import { AppType } from "@notipal/common";
import { hc } from "hono/client";

const client = hc<AppType>(
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
);

export const apiClient = client;
