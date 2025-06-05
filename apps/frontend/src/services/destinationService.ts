// Removed: import { fetchApiClient } from "@/lib/apiClient";
import {
	type Destination,
	apiResponseSchema,
	destinationSchema,
} from "@notipal/common";
import { z } from "zod";

// Define a type for the API client methods expected by the service
export interface ApiClientMethods {
	get: (url: string, options?: RequestInit) => Promise<Response>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	post: (url: string, body: any, options?: RequestInit) => Promise<Response>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	put: (url: string, body: any, options?: RequestInit) => Promise<Response>;
	del: (url: string, options?: RequestInit) => Promise<Response>; // 'del' for delete
}

/**
 * Helper function to handle errors by attempting to parse response body.
 */
async function handleErrorResponse(response: Response, defaultMessage: string) {
	let errorBody = defaultMessage;
	try {
		const text = await response.text();
		if (text) {
			errorBody = `${defaultMessage}: ${response.status} ${text}`;
		}
	} catch (e) {
		// Ignore if reading text fails, use default message
	}
	return new Error(errorBody);
}

/**
 * Fetches all destinations for the current user.
 */
export const getDestinations = async (
	api: ApiClientMethods,
): Promise<Destination[]> => {
	const response = await api.get("/destinations");
	if (!response.ok) {
		throw await handleErrorResponse(response, "Failed to fetch destinations");
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
export const getDestination = async (
	api: ApiClientMethods,
	id: string,
): Promise<Destination> => {
	const response = await api.get(`/destinations/${id}`);
	if (!response.ok) {
		throw await handleErrorResponse(
			response,
			`Failed to fetch destination with ID ${id}`,
		);
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
export const createDestination = async (
	api: ApiClientMethods,
	data: { name?: string; webhookUrl: string },
): Promise<Destination> => {
	const response = await api.post("/destinations", data); // api.post handles body stringification & headers
	if (!response.ok) {
		throw await handleErrorResponse(response, "Failed to create destination");
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
	api: ApiClientMethods,
	id: string,
	data: { name?: string; webhookUrl: string },
): Promise<Destination> => {
	const response = await api.put(`/destinations/${id}`, data); // api.put handles body stringification & headers
	if (!response.ok) {
		throw await handleErrorResponse(
			response,
			`Failed to update destination with ID ${id}`,
		);
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
export const deleteDestination = async (
	api: ApiClientMethods,
	id: string,
): Promise<void> => {
	const response = await api.del(`/destinations/${id}`); // api.del for delete
	if (!response.ok) {
		throw await handleErrorResponse(
			response,
			`Failed to delete destination with ID ${id}`,
		);
	}
	// No content expected for a successful DELETE
};
