import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
export declare const deleteUserNotionIntegrationUseCase: (deps: {
    userNotionIntegrationRepository: UserNotionIntegrationRepository;
}) => (input: {
    integrationId: string;
    userId: string;
}) => Promise<{
    success: boolean;
    message: string;
}>;
