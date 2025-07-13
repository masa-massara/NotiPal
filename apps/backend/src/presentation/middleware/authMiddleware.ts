import { type Auth, getAuth } from "firebase-admin/auth";
import type { MiddlewareHandler } from "hono";

export const createAuthMiddleware = (authInstance: Auth): MiddlewareHandler => {
	return async (c, next) => {
		const authHeader = c.req.header("Authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return c.json(
				{
					error: "Unauthorized",
					message: "Bearer token is missing or invalid.",
				},
				401,
			);
		}

		const idToken = authHeader.split("Bearer ")[1];

		try {
			const decodedToken = await authInstance.verifyIdToken(idToken);

			if (!decodedToken || !decodedToken.uid) {
				return c.json(
					{ error: "Unauthorized", message: "Invalid token credentials." },
					401,
				);
			}

			const uid = decodedToken.uid;
			c.set("userId", uid);
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				"code" in error &&
				typeof error.code === "string" &&
				error.code === "auth/id-token-expired"
			) {
				return c.json(
					{ error: "Unauthorized", message: "Token has expired." },
					401,
				);
			}
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred.";
			return c.json(
				{
					error: "Unauthorized",
					message: `Invalid or expired token: ${errorMessage}`,
				},
				401,
			);
		}

		await next();
	};
};
