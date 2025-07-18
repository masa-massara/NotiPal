import { apiClient } from "@/lib/apiClient";
import type {
	CreateUserNotionIntegrationApiInput,
	UserNotionIntegration as NotionIntegration,
} from "@notipal/common";
import {
	apiResponseSchema,
	userNotionIntegrationSchema,
} from "@notipal/common";
import { z } from "zod";

/**
 * Fetches all Notion integrations for the current user.
 */
export const getUserNotionIntegrations = async (): Promise<
	NotionIntegration[]
> => {
	const response = await apiClient.me["notion-integrations"].$get();
	const json = await response.json();
	const validationResult = apiResponseSchema(
		z.array(userNotionIntegrationSchema),
	).safeParse(json);
	if (!validationResult.success) {
		console.error(
			"API response schema validation failed:",
			validationResult.error,
		);
		throw new Error("Received an invalid API response format.");
	}
	const apiData = validationResult.data;
	if (apiData.success === false) {
		throw new Error(
			apiData.message || `API returned error code: ${apiData.error.code}`,
		);
	}
	return apiData.data;
};

/**
 * Creates a new Notion integration for the current user.
 * @param data - Object containing the name and token for the new integration.
 */
export const createUserNotionIntegration = async (
	data: CreateUserNotionIntegrationApiInput,
): Promise<NotionIntegration> => {
	const response = await apiClient.me["notion-integrations"].$post({
		json: data,
	});
	const json = await response.json();
	const validationResult = apiResponseSchema(
		userNotionIntegrationSchema,
	).safeParse(json);
	if (!validationResult.success) {
		console.error(
			"API response schema validation failed:",
			validationResult.error,
		);
		throw new Error("Received an invalid API response format.");
	}
	const apiData = validationResult.data;
	if (apiData.success === false) {
		throw new Error(
			apiData.message || `API returned error code: ${apiData.error.code}`,
		);
	}
	return apiData.data;
};

/**
 * Deletes a specific Notion integration for the current user.
 * @param integrationId - The ID of the Notion integration to delete.
 */
export const deleteUserNotionIntegration = async (
	integrationId: string,
): Promise<void> => {
	const response = await apiClient.me["notion-integrations"][
		":integrationId"
	].$delete({ param: { integrationId } });
	if (!response.ok) {
		throw new Error(
			`Failed to delete Notion integration with ID ${integrationId}`,
		);
	}
};
