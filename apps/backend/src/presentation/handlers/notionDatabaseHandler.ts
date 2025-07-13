import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type {
	GetNotionDatabasePropertiesInput,
	GetNotionDatabasePropertiesOutput,
} from "../../application/dtos/notionDatabaseDTOs";
import type { InitializedUseCases } from "../../di";

export const getNotionDatabasePropertiesHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const databaseId = c.req.param("databaseId");
		const integrationId = c.req.query("integrationId");
		const userId = c.get("userId");

		if (typeof userId !== "string") {
			console.error(
				"CRITICAL: userId not found in context or is not a string after authMiddleware.",
			);
			throw new HTTPException(401, {
				message: "Unauthorized: User ID not found or invalid.",
			});
		}

		if (!databaseId) {
			throw new HTTPException(400, {
				message: "databaseId path parameter is required",
			});
		}

		if (!integrationId) {
			throw new HTTPException(400, {
				message: "integrationId query parameter is required",
			});
		}

		const input: GetNotionDatabasePropertiesInput = {
			databaseId,
			userId,
			integrationId,
		};

		const rawOutput: GetNotionDatabasePropertiesOutput =
			await useCases.getNotionDatabasePropertiesUseCase(input);
		const sanitizedOutput = rawOutput.map(({ id, name, type, options }) => ({
			type,
			name,
			id,
			...(options ? { options } : {}),
		}));
		return c.json(sanitizedOutput, 200);
	} catch (error: unknown) {
		console.error(
			`Error in getNotionDatabasePropertiesHandler for DB ${c.req.param("databaseId")}:`,
			error,
		);
		if (error instanceof HTTPException) {
			throw error;
		}
		const err = error as Error;
		throw new HTTPException(500, {
			message: "Failed to get Notion database properties",
			cause: err.message || String(error),
		});
	}
};
