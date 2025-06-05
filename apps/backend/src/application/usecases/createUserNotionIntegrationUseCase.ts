import type { InternalUserNotionIntegration } from "@notipal/common";
import type { CreateUserNotionIntegrationApiInput } from "@notipal/common";
import { v4 as uuidv4 } from "uuid";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type { EncryptionService } from "../services/encryptionService";

export const createUserNotionIntegrationUseCase = (deps: {
	userNotionIntegrationRepository: UserNotionIntegrationRepository;
	encryptionService: EncryptionService;
}) => {
	return async (
		input: { userId: string } & CreateUserNotionIntegrationApiInput,
	): Promise<Omit<InternalUserNotionIntegration, "notionIntegrationToken">> => {
		const id = uuidv4();
		const encryptedToken = await deps.encryptionService.encrypt(
			input.notionIntegrationToken,
		);
		const now = new Date();
		const newIntegration: InternalUserNotionIntegration = {
			id,
			userId: input.userId,
			integrationName: input.integrationName,
			notionIntegrationToken: encryptedToken,
			createdAt: now,
			updatedAt: now,
		};
		await deps.userNotionIntegrationRepository.save(newIntegration);
		// notionIntegrationTokenはAPIレスポンスに含めない
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { notionIntegrationToken, ...publicFields } = newIntegration;
		return publicFields;
	};
};
