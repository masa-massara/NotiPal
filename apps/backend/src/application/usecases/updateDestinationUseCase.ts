// src/application/usecases/updateDestinationUseCase.ts
import type {
	Destination as DestinationData,
	UpdateDestinationApiInput,
} from "@notipal/common";
import { Destination } from "../../domain/entities/destination";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";

// ユースケースの入力: 更新するIDと、更新可能なフィールド
export interface UpdateDestinationInput extends UpdateDestinationApiInput {
	id: string;
	userId: string;
}

// ユースケースの出力: 更新後の送信先情報
export type UpdateDestinationOutput = DestinationData;

export const createUpdateDestinationUseCase = (dependencies: {
	destinationRepository: DestinationRepository;
}) => {
	const { destinationRepository } = dependencies;

	return async (
		input: UpdateDestinationInput,
	): Promise<UpdateDestinationOutput> => {
		const existing = await destinationRepository.findById(
			input.id,
			input.userId,
		);
		if (!existing) {
			throw new Error(
				`Destination with id ${input.id} not found or not accessible by user ${input.userId}.`,
			);
		}

		// エンティティとして再構築して更新メソッドを使う
		const entity = new Destination(
			existing.id,
			existing.webhookUrl,
			existing.userId,
			existing.name,
			new Date(existing.createdAt),
			new Date(existing.updatedAt),
		);
		if (input.name !== undefined && entity.name !== input.name) {
			entity.updateName(input.name);
		}
		if (
			input.webhookUrl !== undefined &&
			entity.webhookUrl !== input.webhookUrl
		) {
			entity.updateWebhookUrl(input.webhookUrl);
		}

		const updatedData: DestinationData = {
			id: entity.id,
			userId: entity.userId,
			name: entity.name,
			webhookUrl: entity.webhookUrl,
			createdAt: entity.createdAt.toISOString(),
			updatedAt: entity.updatedAt.toISOString(),
		};
		await destinationRepository.save(updatedData);
		return updatedData;
	};
};
