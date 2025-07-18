import { idTokenAtom } from "@/store/globalAtoms";
import { store } from "@/store/store";
import type { AppType } from "@notipal/common";
import { hc } from "hono/client";

let apiBaseUrl: string;

if (process.env.NODE_ENV === "production") {
	apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_PROD || "";
} else {
	apiBaseUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL_DEV || "http://localhost:8080";
}

if (!apiBaseUrl) {
	console.error(
		"API base URL is not set. Please check your environment variables (NEXT_PUBLIC_API_BASE_URL_PROD or NEXT_PUBLIC_API_BASE_URL_DEV).",
	);
}

const client = hc<AppType>(apiBaseUrl, {
	headers: () => {
		const idToken = store.get(idTokenAtom);
		if (!idToken) {
			throw new Error("ID token is not available for API request.");
		}
		return {
			Authorization: `Bearer ${idToken}`,
		};
	},
});

export const apiClient = client;
