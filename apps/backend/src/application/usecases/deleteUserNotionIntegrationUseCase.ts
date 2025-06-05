import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";

export const deleteUserNotionIntegrationUseCase = (deps: {
	userNotionIntegrationRepository: UserNotionIntegrationRepository;
}) => {
	return async (input: { integrationId: string; userId: string }): Promise<{
		success: boolean;
		message: string;
	}> => {
		const integration = await deps.userNotionIntegrationRepository.findById(
			input.integrationId,
			input.userId,
		);
		if (!integration) {
			return {
				success: false,
				message: `Notion integration with ID ${input.integrationId} not found or user does not have permission.`,
			};
		}
		await deps.userNotionIntegrationRepository.deleteById(
			input.integrationId,
			input.userId,
		);
		return {
			success: true,
			message: "Notion integration deleted successfully.",
		};
	};
};
