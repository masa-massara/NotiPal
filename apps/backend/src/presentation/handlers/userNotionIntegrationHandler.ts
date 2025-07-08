import { createUserNotionIntegrationApiSchema } from "@notipal/common";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ListNotionDatabasesInput } from "../../application/dtos/notionDatabaseDTOs";
import type { InitializedUseCases } from "../../di";

export const createIntegrationHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		if (typeof userId !== "string") {
			throw new HTTPException(401, {
				message: "User ID not found or invalid.",
			});
		}
		const body = await c.req.json();
		const parseResult = createUserNotionIntegrationApiSchema.safeParse(body);
		if (!parseResult.success) {
			throw new HTTPException(400, {
				message: "Validation Error",
				cause: parseResult.error.format(),
			});
		}
		const input = { userId, ...parseResult.data };
		const output = await useCases.createUserNotionIntegrationUseCaseFn(input);
		return c.json(output, 201);
	} catch (error: unknown) {
		if (error instanceof HTTPException) {
			throw error;
		}
		const message = error instanceof Error ? error.message : String(error);
		throw new HTTPException(500, {
			message: "Failed to create Notion integration",
			cause: message,
		});
	}
};

export const listIntegrationsHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const userId = c.get("userId");
		if (typeof userId !== "string") {
			throw new HTTPException(401, {
				message: "User ID not found or invalid.",
			});
		}
		const output = await useCases.listUserNotionIntegrationsUseCaseFn({
			userId,
		});
		return c.json(output, 200);
	} catch (error: unknown) {
		if (error instanceof HTTPException) {
			throw error;
		}
		const message = error instanceof Error ? error.message : String(error);
		throw new HTTPException(500, {
			message: "Failed to list Notion integrations",
			cause: message,
		});
	}
};

export const deleteIntegrationHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	try {
		const integrationId = c.req.param("integrationId");
		const userId = c.get("userId");
		if (typeof userId !== "string") {
			throw new HTTPException(401, {
				message: "User ID not found or invalid.",
			});
		}
		if (!integrationId) {
			throw new HTTPException(400, {
				message: "integrationId path parameter is required",
			});
		}
		const result = await useCases.deleteUserNotionIntegrationUseCaseFn({
			integrationId,
			userId,
		});
		if (!result.success) {
			throw new HTTPException(404, { message: result.message });
		}
		return c.body(null, 204);
	} catch (error: unknown) {
		if (error instanceof HTTPException) {
			throw error;
		}
		const message = error instanceof Error ? error.message : String(error);
		throw new HTTPException(500, {
			message: "Failed to delete Notion integration",
			cause: message,
		});
	}
};

export const listUserAccessibleDatabasesHandler = async (
	c: Context,
	useCases: InitializedUseCases,
) => {
	console.log(
		"【BE Log 1 at Handler】listUserAccessibleDatabasesHandler - Entry",
	);
	try {
		const integrationId = c.req.param("integrationId");
		const userId = c.get("userId");

		console.log(
			`【BE Log 2 at Handler】Integration ID: ${integrationId}, User ID: ${userId}`,
		);

		if (typeof userId !== "string") {
			console.error(
				"【BE Log 2.1 at Handler】CRITICAL: userId not found in context or is not a string after authMiddleware.",
			);
			throw new HTTPException(401, {
				message: "Unauthorized: User ID not found or invalid.",
			});
		}
		if (!integrationId) {
			console.error(
				"【BE Log 2.2 at Handler】integrationId path parameter is required.",
			);
			throw new HTTPException(400, {
				message: "integrationId path parameter is required",
			});
		}

		const input: ListNotionDatabasesInput = {
			integrationId,
			userId,
		};

		console.log(
			"【BE Log 3 at Handler】Calling ListNotionDatabasesUseCase with input:",
			JSON.stringify(input, null, 2),
		);
		const output = await useCases.listNotionDatabasesUseCase(input);
		console.log(
			"【BE Log 4 at Handler】ListNotionDatabasesUseCase returned output:",
			JSON.stringify(output, null, 2),
		);

		const sanitizedOutput = output.map(({ id, name }) => ({ id, name }));
		return c.json(sanitizedOutput, 200);
	} catch (error: unknown) {
		if (error instanceof HTTPException) {
			throw error;
		}
		const message = error instanceof Error ? error.message : String(error);
		console.error(
			"【BE Log 5 at Handler】Error in listUserAccessibleDatabasesHandler:",
			message,
		);
		throw new HTTPException(500, {
			message: "Failed to list accessible Notion databases",
			cause: message,
		});
	}
};
