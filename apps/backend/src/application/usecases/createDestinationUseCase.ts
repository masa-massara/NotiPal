import type {
	CreateDestinationApiInput,
	Destination as DestinationData,
} from "@notipal/common";
import { v4 as uuidv4 } from "uuid"; // ID生成用
// src/application/usecases/createDestinationUseCase.ts
import { Destination } from "../../domain/entities/destination";
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";

// ユースケースに入力されるデータのための型 (DTO)
export interface CreateDestinationInput {
	webhookUrl: string;
	name?: string; // 送信先名はオプション
	userId: string; // ★★★ Input DTOにuserIdを追加 ★★★
}

// ユースケースが出力するデータのための型 (DTO) - 作成された送信先情報を返す
export interface CreateDestinationOutput {
	id: string;
	webhookUrl: string;
	name?: string;
	userId: string; // ★★★ Output DTOにuserIdを追加 ★★★
	createdAt: Date;
	updatedAt: Date;
}

export const createCreateDestinationUseCase = (dependencies: {
	destinationRepository: DestinationRepository;
}) => {
	const { destinationRepository } = dependencies;

	return async (
		input: CreateDestinationApiInput & { userId: string },
	): Promise<DestinationData> => {
		const id = uuidv4();
		const newDestinationEntity = new Destination(
			id,
			input.webhookUrl,
			input.userId,
			input.name,
		);

		const destinationData: DestinationData = {
			id: newDestinationEntity.id,
			userId: newDestinationEntity.userId,
			name: newDestinationEntity.name,
			webhookUrl: newDestinationEntity.webhookUrl,
			createdAt: newDestinationEntity.createdAt.toISOString(),
			updatedAt: newDestinationEntity.updatedAt.toISOString(),
		};

		await destinationRepository.save(destinationData);
		return destinationData;
	};
};
