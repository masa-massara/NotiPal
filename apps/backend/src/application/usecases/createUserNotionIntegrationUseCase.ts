import { v4 as uuidv4 } from "uuid";
import { UserNotionIntegration } from "../../domain/entities/userNotionIntegration";
import type { UserNotionIntegrationRepository } from "../../domain/repositories/userNotionIntegrationRepository";
import type {
	CreateUserNotionIntegrationInput,
	CreateUserNotionIntegrationOutput,
} from "../dtos/userNotionIntegrationDTOs";
import type { EncryptionService } from "../services/encryptionService";

export class CreateUserNotionIntegrationUseCase {
	constructor(
		private readonly userNotionIntegrationRepository: UserNotionIntegrationRepository,
		private readonly encryptionService: EncryptionService,
	) {}

	async execute(
		input: CreateUserNotionIntegrationInput,
	): Promise<CreateUserNotionIntegrationOutput> {
		const id = uuidv4();
		const encryptedToken = await this.encryptionService.encrypt(
			input.notionIntegrationToken,
		);

		const newIntegration = new UserNotionIntegration(
			input.userId,
			input.integrationName,
			encryptedToken,
			id,
		);

		await this.userNotionIntegrationRepository.save(newIntegration);

		return {
			id: newIntegration.id,
			integrationName: newIntegration.integrationName,
			userId: newIntegration.userId,
			createdAt: newIntegration.createdAt,
			updatedAt: newIntegration.updatedAt,
		};
	}
}
