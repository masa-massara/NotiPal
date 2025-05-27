import { type FetchOptions, fetchApiClient } from "@/lib/apiClient"; // Assuming FetchOptions is exported
import { idTokenAtom } from "@/store/globalAtoms";
import { useAtomValue } from "jotai";
import { useCallback } from "react";

export function useApiClient() {
	const idToken = useAtomValue(idTokenAtom);

	const get = useCallback(
		async (url: string, options: FetchOptions = {}) => {
			return fetchApiClient(url, idToken, { ...options, method: "GET" });
		},
		[idToken],
	);

	const post = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async (url: string, body: any, options: FetchOptions = {}) => {
			return fetchApiClient(url, idToken, {
				...options,
				method: "POST",
				headers: { ...options.headers, "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
		},
		[idToken],
	);

	const put = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async (url: string, body: any, options: FetchOptions = {}) => {
			return fetchApiClient(url, idToken, {
				...options,
				method: "PUT",
				headers: { ...options.headers, "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
		},
		[idToken],
	);

	const del = useCallback(
		async (url: string, options: FetchOptions = {}) => {
			// 'delete' is a reserved keyword
			return fetchApiClient(url, idToken, { ...options, method: "DELETE" });
		},
		[idToken],
	);

	return { get, post, put, del }; // 'del' instead of 'delete'
}
