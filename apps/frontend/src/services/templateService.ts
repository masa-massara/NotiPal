import { apiClient } from "@/lib/apiClient";
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
export const getTemplates = async (): Promise<Template[]> => {
	const response = await apiClient.templates.$get();
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
export const getTemplate = async (id: string): Promise<Template> => {
	const response = await apiClient.templates[":id"].$get({ param: { id } });
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
	data: CreateTemplateData,
): Promise<Template> => {
	const response = await apiClient.templates.$post({ json: data });
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
	id: string,
	data: UpdateTemplateData,
): Promise<Template> => {
	const response = await apiClient.templates[":id"].$put({
		param: { id },
		json: data,
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
export const deleteTemplate = async (id: string): Promise<void> => {
	const response = await apiClient.templates[":id"].$delete({ param: { id } });
	if (!response.ok) {
		throw new Error(`Failed to delete template with ID ${id}`);
	}
	// No content expected for a successful DELETE
};
