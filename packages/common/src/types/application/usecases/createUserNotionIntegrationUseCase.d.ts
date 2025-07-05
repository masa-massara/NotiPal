import type { InternalUserNotionIntegration } from "@notipal/common";
import type { CreateUserNotionIntegrationApiInput } from "@notipal/common";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { EncryptionService } from "../services/encryptionService";
export declare const createUserNotionIntegrationUseCase: (deps: {
    userNotionIntegrationRepository: UserNotionIntegrationRepository;
    encryptionService: EncryptionService;
}) => (input: {
    userId: string;
} & CreateUserNotionIntegrationApiInput) => Promise<Omit<InternalUserNotionIntegration, "notionIntegrationToken">>;
