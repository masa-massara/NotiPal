import { apiClient } from "@/lib/apiClient";
import {
	type Destination,
	apiResponseSchema,
	destinationSchema,
} from "@notipal/common";
import { z } from "zod";

/**
 * Fetches all destinations for the current user.
 */
export const getDestinations = async (): Promise<Destination[]> => {
	const response = await apiClient.destinations.$get();
	if (!response.ok) {
		throw new Error("Failed to fetch destinations");
	}
	const json = await response.json();
	const validationResult = apiResponseSchema(
		z.array(destinationSchema),
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
 * Fetches a single destination by its ID.
 * @param id - The ID of the destination to fetch.
 */
export const getDestination = async (id: string): Promise<Destination> => {
	const response = await apiClient.destinations[":id"].$get({ param: { id } });
	if (!response.ok) {
		throw new Error(`Failed to fetch destination with ID ${id}`);
	}
	const json = await response.json();
	const validationResult = apiResponseSchema(destinationSchema).safeParse(json);
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
 * Creates a new destination for the current user.
 * @param data - Object containing the name (optional) and webhookUrl for the new destination.
 */
export const createDestination = async (data: {
	name?: string;
	webhookUrl: string;
}): Promise<Destination> => {
	const response = await apiClient.destinations.$post({ json: data });
	if (!response.ok) {
		throw new Error("Failed to create destination");
	}
	const json = await response.json();
	const validationResult = apiResponseSchema(destinationSchema).safeParse(json);
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
 * Updates an existing destination.
 * @param id - The ID of the destination to update.
 * @param data - Object containing the name (optional) and webhookUrl to update.
 */
export const updateDestination = async (
	id: string,
	data: { name?: string; webhookUrl: string },
): Promise<Destination> => {
	const response = await apiClient.destinations[":id"].$put(
		{
			param: { id },
		},
		data as any,
	);
	if (!response.ok) {
		throw new Error(`Failed to update destination with ID ${id}`);
	}
	const json = await response.json();
	const validationResult = apiResponseSchema(destinationSchema).safeParse(json);
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
 * Deletes a specific destination for the current user.
 * @param id - The ID of the destination to delete.
 */
export const deleteDestination = async (id: string): Promise<void> => {
	const response = await apiClient.destinations[":id"].$delete({
		param: { id },
	});
	if (!response.ok) {
		throw new Error(`Failed to delete destination with ID ${id}`);
	}
	// No content expected for a successful DELETE
};
