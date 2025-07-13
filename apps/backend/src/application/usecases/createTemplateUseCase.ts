import type { CreateTemplateApiInput, Template } from "@notipal/common";
import { v4 as uuidv4 } from "uuid";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { NotionApiService } from "../../domain/services/notionApiService";
import type { EncryptionService } from "../services/encryptionService";

export const createCreateTemplateUseCase = (dependencies: {
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
	} = dependencies;

	return async (
		input: CreateTemplateApiInput & { userId: string },
	): Promise<Template> => {
		const userIntegration = await userNotionIntegrationRepository.findById(
			input.userNotionIntegrationId,
			input.userId,
		);
		if (!userIntegration) {
			throw new Error("Notion integration not found or access denied.");
		}
		const decryptedNotionToken = await encryptionService.decrypt(
			userIntegration.notionIntegrationToken,
		);
		const schema = await notionApiService.getDatabaseSchema(
			input.notionDatabaseId,
			decryptedNotionToken,
		);
		if (!schema) {
			throw new Error("Notion database not found or inaccessible.");
		}
		const now = new Date();
		const newTemplate: Template = {
			id: uuidv4(),
			userId: input.userId,
			name: input.name,
			notionDatabaseId: input.notionDatabaseId,
			userNotionIntegrationId: input.userNotionIntegrationId,
			body: input.body,
			conditions: input.conditions || [],
			destinationId: input.destinationId,
			createdAt: now.toISOString(),
			updatedAt: now.toISOString(),
		};
		await templateRepository.save(newTemplate);
		return newTemplate;
	};
};
