"use client";

import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/lib/firebase";
import { currentUserAtom, idTokenAtom } from "@/store/globalAtoms";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { Provider as JotaiProvider, useSetAtom } from "jotai";
import { queryClientAtom } from "jotai-tanstack-query";
import type React from "react";
import { useEffect } from "react";

const sharedQueryClient = new QueryClient();

const AuthStateSynchronizer = () => {
	const setCurrentUser = useSetAtom(currentUserAtom);
	const setIdToken = useSetAtom(idTokenAtom);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			async (user: FirebaseUser | null) => {
				if (user) {
					setCurrentUser(user);
					const token = await user.getIdToken();
					setIdToken(token);
				} else {
					setCurrentUser(null);
					setIdToken(null);
				}
			},
		);
		return () => unsubscribe();
	}, [setCurrentUser, setIdToken]);

	return null;
};

export function Providers({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		store.set(queryClientAtom, sharedQueryClient);
	}, []);

	return (
		<JotaiProvider store={store}>
			<QueryClientProvider client={sharedQueryClient}>
				<AuthStateSynchronizer />
				{children}
				<Toaster />
			</QueryClientProvider>
		</JotaiProvider>
	);
}
