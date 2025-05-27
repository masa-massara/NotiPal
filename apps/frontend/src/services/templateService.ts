import { fetchApiClient } from "@/lib/apiClient";
import type {
	CreateTemplateData,
	Template,
	UpdateTemplateData,
} from "@/types/template";

/**
 * Fetches all templates for the current user.
 */
export const getTemplates = async (idToken: string): Promise<Template[]> => {
	const response = await fetchApiClient("/templates", idToken, {
		method: "GET",
	});
	// No need to check response.ok here if fetchApiClient handles it by throwing an error
	return response.json();
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
	return response.json();
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
	return response.json();
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
	return response.json();
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
