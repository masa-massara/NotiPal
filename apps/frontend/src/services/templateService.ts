import { fetchApiClient } from "@/lib/apiClient";
import {
	type Template,
	apiResponseSchema,
	templateSchema,
} from "@notipal/common";
import type {
	CreateTemplateApiInput as CreateTemplateData,
	UpdateTemplateApiInput as UpdateTemplateData,
} from "@notipal/common";
import { z } from "zod";

/**
 * Fetches all templates for the current user.
 */
export const getTemplates = async (idToken: string): Promise<Template[]> => {
	const response = await fetchApiClient("/templates", idToken, {
		method: "GET",
	});
	const json = await response.json();
	const validationResult = apiResponseSchema(z.array(templateSchema)).safeParse(
		json,
	);
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
 * Fetches a single template by its ID.
 * @param id - The ID of the template to fetch.
 */
export const getTemplate = async (
	idToken: string,
	id: string,
): Promise<Template> => {
	const response = await fetchApiClient(`/templates/${id}`, idToken, {
		method: "GET",
	});
	const json = await response.json();
	const validationResult = apiResponseSchema(templateSchema).safeParse(json);
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
 * Creates a new template for the current user.
 * @param data - Object containing the data for the new template.
 */
export const createTemplate = async (
	idToken: string,
	data: CreateTemplateData,
): Promise<Template> => {
	const response = await fetchApiClient("/templates", idToken, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	const json = await response.json();
	const validationResult = apiResponseSchema(templateSchema).safeParse(json);
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
 * Updates an existing template.
 * @param id - The ID of the template to update.
 * @param data - Object containing the data to update.
 */
export const updateTemplate = async (
	idToken: string,
	id: string,
	data: UpdateTemplateData,
): Promise<Template> => {
	const response = await fetchApiClient(`/templates/${id}`, idToken, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	const json = await response.json();
	const validationResult = apiResponseSchema(templateSchema).safeParse(json);
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
 * Deletes a specific template for the current user.
 * @param id - The ID of the template to delete.
 */
export const deleteTemplate = async (
	idToken: string,
	id: string,
): Promise<void> => {
	await fetchApiClient(`/templates/${id}`, idToken, {
		method: "DELETE",
	});
	// No content expected for a successful DELETE
};
