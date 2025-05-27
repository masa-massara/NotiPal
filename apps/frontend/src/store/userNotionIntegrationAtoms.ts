import {
	createUserNotionIntegration,
	deleteUserNotionIntegration,
	getUserNotionIntegrations,
} from "@/services/userNotionIntegrationService";
import { currentUserAtom, idTokenAtom } from "@/store/globalAtoms"; // idTokenAtom をインポート
import type { NotionIntegration } from "@/types/notionIntegration";
import type { QueryClient } from "@tanstack/react-query";
import { atom } from "jotai";
import {
	atomWithMutation,
	atomWithQuery,
	queryClientAtom, // onSuccess の中で queryClient を取得するために使う
} from "jotai-tanstack-query";

export const userNotionIntegrationsQueryAtom = atomWithQuery<
	NotionIntegration[],
	Error
>((get) => ({
	// この get は atomWithQuery のセットアップ関数に渡される Jotai の Getter
	queryKey: ["userNotionIntegrations", get(currentUserAtom)?.uid],
	queryFn: async () => {
		const currentUser = get(currentUserAtom);
		const currentIdToken = get(idTokenAtom); // idTokenAtom からトークンを取得
		if (!currentUser?.uid) {
			// このエラーは enabled: !!get(currentUserAtom)?.uid で基本的には発生しないはず
			throw new Error(
				"User not authenticated. Cannot fetch Notion integrations.",
			);
		}
		if (!currentIdToken) {
			// currentUser がいても、トークン取得に失敗するケースを考慮
			throw new Error(
				"ID token not available. Cannot fetch Notion integrations.",
			);
		}
		return getUserNotionIntegrations(currentIdToken); // サービス関数にトークンを渡す
	},
	enabled: !!get(currentUserAtom)?.uid && !!get(idTokenAtom), // トークンが利用可能な場合のみ有効にする
}));

export const userNotionIntegrationsAtom = atom((get) => {
	const queryResult = get(userNotionIntegrationsQueryAtom);
	return queryResult?.data;
});

export const createUserNotionIntegrationMutationAtom = atomWithMutation<
	NotionIntegration, // TData
	{ integrationName: string; notionIntegrationToken: string }, // TVariables
	Error, // TError
	unknown // TContext
>((getAtomInSetup) => ({
	mutationFn: async (variables: {
		integrationName: string;
		notionIntegrationToken: string;
	}) => {
		const currentIdToken = getAtomInSetup(idTokenAtom); // トークンを取得
		if (!currentIdToken) {
			throw new Error("ID token not available for mutation.");
		}
		// サービス関数にトークンと他の変数を渡す
		return createUserNotionIntegration(currentIdToken, {
			integrationName: variables.integrationName,
			notionIntegrationToken: variables.notionIntegrationToken,
		});
	},
	onSuccess: (
		_data: NotionIntegration,
		_variables: { integrationName: string; notionIntegrationToken: string },
		_context: unknown,
	) => {
		const queryClient: QueryClient = getAtomInSetup(queryClientAtom);
		const currentUser = getAtomInSetup(currentUserAtom);
		if (currentUser?.uid) {
			queryClient.invalidateQueries({
				queryKey: ["userNotionIntegrations", currentUser.uid],
			});
		}
	},
}));

export const deleteUserNotionIntegrationMutationAtom = atomWithMutation<
	void, // TData
	string, // TVariables (integrationId)
	Error, // TError
	unknown // TContext
>((getAtomInSetup) => ({
	mutationFn: async (integrationId: string) => {
		const currentIdToken = getAtomInSetup(idTokenAtom); // トークンを取得
		if (!currentIdToken) {
			throw new Error("ID token not available for mutation.");
		}
		return deleteUserNotionIntegration(currentIdToken, integrationId); // サービス関数にトークンとIDを渡す
	},
	onSuccess: (
		// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
		_data: void,
		_variables: string,
		_context: unknown,
	) => {
		const queryClient: QueryClient = getAtomInSetup(queryClientAtom);
		const currentUser = getAtomInSetup(currentUserAtom);
		if (currentUser?.uid) {
			queryClient.invalidateQueries({
				queryKey: ["userNotionIntegrations", currentUser.uid],
			});
		}
	},
}));
