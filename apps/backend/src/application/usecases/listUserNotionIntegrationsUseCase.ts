import type { InternalUserNotionIntegration } from "@notipal/common";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";

export const listUserNotionIntegrationsUseCase = (deps: {
	userNotionIntegrationRepository: UserNotionIntegrationRepository;
}) => {
	return async (input: { userId: string }): Promise<
		Omit<InternalUserNotionIntegration, "notionIntegrationToken">[]
	> => {
		const integrations =
			await deps.userNotionIntegrationRepository.findAllByUserId(input.userId);
		return integrations.map(({ notionIntegrationToken, ...rest }) => rest);
	};
};
