import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { NotionApiService } from "../../domain/services/notionApiService";
import type { ListNotionDatabasesInput, ListNotionDatabasesOutput } from "../dtos/notionDatabaseDTOs";
import type { EncryptionService } from "../services/encryptionService";
export declare const createListNotionDatabasesUseCase: (deps: {
    userNotionIntegrationRepository: UserNotionIntegrationRepository;
    encryptionService: EncryptionService;
    notionApiService: NotionApiService;
}) => (input: ListNotionDatabasesInput) => Promise<ListNotionDatabasesOutput>;
