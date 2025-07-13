import type { Template, UpdateTemplateApiInput } from "@notipal/common";
import type { TemplateRepository } from "../../domain/repositories/templateRepository";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { NotionApiService } from "../../domain/services/notionApiService";
import type { EncryptionService } from "../services/encryptionService";
export declare const createUpdateTemplateUseCase: (deps: {
    templateRepository: TemplateRepository;
    userNotionIntegrationRepository: UserNotionIntegrationRepository;
    notionApiService: NotionApiService;
    encryptionService: EncryptionService;
}) => (input: UpdateTemplateApiInput & {
    id: string;
    userId: string;
}) => Promise<Template>;
