import type { InternalUserNotionIntegration } from "@notipal/common";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
export declare const listUserNotionIntegrationsUseCase: (deps: {
    userNotionIntegrationRepository: UserNotionIntegrationRepository;
}) => (input: {
    userId: string;
}) => Promise<Omit<InternalUserNotionIntegration, "notionIntegrationToken">[]>;
