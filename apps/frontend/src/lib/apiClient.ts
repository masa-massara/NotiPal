import { idTokenAtom } from "@/store/globalAtoms";
import { store } from "@/store/store";
import type { AppType } from "@notipal/common";
import { hc } from "hono/client";
const client = hc<AppType>(
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
	{
		headers: () => {
			// headersを関数として定義
			const idToken = store.get(idTokenAtom);

			if (!idToken) {
				throw new Error("ID token is not available for API request.");
			}

			return {
				Authorization: `Bearer ${idToken}`,
			};
		},
	},
);

export const apiClient = client;
