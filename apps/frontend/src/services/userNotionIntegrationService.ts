import { fetchApiClient } from "@/lib/apiClient";
import {
	type UserNotionIntegration as NotionIntegration,
	apiResponseSchema,
	userNotionIntegrationSchema,
} from "@notipal/common";
import { z } from "zod";

/**
 * Fetches all Notion integrations for the current user.
 */
export const getUserNotionIntegrations = async (
	idToken: string,
): Promise<NotionIntegration[]> => {
	const response = await fetchApiClient("/me/notion-integrations", idToken, {
		method: "GET",
	});
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
	idToken: string,
	data: {
		integrationName: string;
		notionIntegrationToken: string;
	},
): Promise<NotionIntegration> => {
	const response = await fetchApiClient("/me/notion-integrations", idToken, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
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
	idToken: string,
	integrationId: string,
): Promise<void> => {
	await fetchApiClient(`/me/notion-integrations/${integrationId}`, idToken, {
		method: "DELETE",
	});
	// fetchApiClient handles non-ok responses by throwing an error
	// For DELETE requests, typically no body is returned on success (e.g. 204 No Content)
	// so we don't call response.json()
};
