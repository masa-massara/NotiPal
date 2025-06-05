// src/application/usecases/updateTemplateUseCase.ts
import type { Template, UpdateTemplateApiInput } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { NotionApiService } from "../../domain/services/notionApiService";
import type { EncryptionService } from "../services/encryptionService";

export const createUpdateTemplateUseCase = (deps: {
	templateRepository: TemplateRepository;
	userNotionIntegrationRepository: UserNotionIntegrationRepository;
	notionApiService: NotionApiService;
	encryptionService: EncryptionService;
}) => {
	const {
		templateRepository,
		userNotionIntegrationRepository,
		notionApiService,
		encryptionService,
	} = deps;

	return async (
		input: UpdateTemplateApiInput & { id: string; userId: string },
	): Promise<Template> => {
		const existing = await templateRepository.findById(input.id, input.userId);
		if (!existing) {
			throw new Error(
				`Template with id ${input.id} not found or not accessible by user ${input.userId}.`,
			);
		}
		let updated = false;
		// userNotionIntegrationId, notionDatabaseIdのバリデーション
		let notionTokenForValidation: string | null = null;
		let newNotionDatabaseId = existing.notionDatabaseId;
		if (input.userNotionIntegrationId !== undefined) {
			if (existing.userNotionIntegrationId !== input.userNotionIntegrationId) {
				if (input.userNotionIntegrationId === null) {
					notionTokenForValidation = null;
				} else {
					const integration = await userNotionIntegrationRepository.findById(
						input.userNotionIntegrationId,
						input.userId,
					);
					if (!integration)
						throw new Error(
							`User Notion Integration with ID ${input.userNotionIntegrationId} not found or access denied.`,
						);
					notionTokenForValidation = await encryptionService.decrypt(
						integration.notionIntegrationToken,
					);
				}
				existing.userNotionIntegrationId = input.userNotionIntegrationId;
				updated = true;
			} else {
				if (existing.userNotionIntegrationId) {
					const integration = await userNotionIntegrationRepository.findById(
						existing.userNotionIntegrationId,
						input.userId,
					);
					if (integration)
						notionTokenForValidation = await encryptionService.decrypt(
							integration.notionIntegrationToken,
						);
				}
			}
		} else if (
			input.notionDatabaseId !== undefined &&
			existing.notionDatabaseId !== input.notionDatabaseId
		) {
			if (existing.userNotionIntegrationId) {
				const integration = await userNotionIntegrationRepository.findById(
					existing.userNotionIntegrationId,
					input.userId,
				);
				if (integration)
					notionTokenForValidation = await encryptionService.decrypt(
						integration.notionIntegrationToken,
					);
			}
		}
		if (input.name !== undefined && existing.name !== input.name) {
			existing.name = input.name;
			updated = true;
		}
		if (
			input.notionDatabaseId !== undefined &&
			existing.notionDatabaseId !== input.notionDatabaseId
		) {
			existing.notionDatabaseId = input.notionDatabaseId;
			newNotionDatabaseId = input.notionDatabaseId;
			updated = true;
		}
		if (
			notionTokenForValidation &&
			(updated ||
				(input.userNotionIntegrationId !== undefined &&
					input.userNotionIntegrationId !== null))
		) {
			const schema = await notionApiService.getDatabaseSchema(
				newNotionDatabaseId,
				notionTokenForValidation,
			);
			if (!schema) {
				throw new Error(
					`Notion database with ID ${newNotionDatabaseId} not found or schema is inaccessible with the provided/existing Notion integration.`,
				);
			}
		} else if (
			input.userNotionIntegrationId !== undefined &&
			input.userNotionIntegrationId === null &&
			existing.userNotionIntegrationId !== null
		) {
			existing.userNotionIntegrationId = null;
			updated = true;
		}
		if (input.body !== undefined && existing.body !== input.body) {
			existing.body = input.body;
			updated = true;
		}
		if (input.conditions !== undefined) {
			existing.conditions = input.conditions;
			updated = true;
		}
		if (
			input.destinationId !== undefined &&
			existing.destinationId !== input.destinationId
		) {
			existing.destinationId = input.destinationId;
			updated = true;
		}
		if (updated) {
			existing.updatedAt = new Date();
			await templateRepository.save(existing);
		}
		return existing;
	};
};
