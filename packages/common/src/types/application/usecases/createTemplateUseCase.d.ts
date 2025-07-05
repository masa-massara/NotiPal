import type { CreateTemplateApiInput, Template } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { NotionApiService } from "../../domain/services/notionApiService";
import type { EncryptionService } from "../services/encryptionService";
export declare const createCreateTemplateUseCase: (dependencies: {
    templateRepository: TemplateRepository;
    userNotionIntegrationRepository: UserNotionIntegrationRepository;
    notionApiService: NotionApiService;
    encryptionService: EncryptionService;
}) => (input: CreateTemplateApiInput & {
    userId: string;
}) => Promise<Template>;
