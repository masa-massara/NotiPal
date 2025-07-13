import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { NotionApiService } from "../../domain/services/notionApiService";
import type { GetNotionDatabasePropertiesInput, GetNotionDatabasePropertiesOutput } from "../dtos/notionDatabaseDTOs";
import type { CacheService } from "../services/cacheService";
import type { EncryptionService } from "../services/encryptionService";
export declare const createGetNotionDatabasePropertiesUseCase: (deps: {
    userNotionIntegrationRepository: UserNotionIntegrationRepository;
    encryptionService: EncryptionService;
    notionApiService: NotionApiService;
    cacheService: CacheService;
}) => (input: GetNotionDatabasePropertiesInput) => Promise<GetNotionDatabasePropertiesOutput>;
