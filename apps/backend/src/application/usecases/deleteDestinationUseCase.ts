// src/application/usecases/deleteDestinationUseCase.ts
import type { DestinationRepository } from "../../domain/repositories/destinationRepository";

export interface DeleteDestinationInput {
	id: string;
	userId: string;
}

export const createDeleteDestinationUseCase = (dependencies: {
	destinationRepository: DestinationRepository;
}) => {
	const { destinationRepository } = dependencies;

	return async (input: DeleteDestinationInput): Promise<void> => {
		await destinationRepository.deleteById(input.id, input.userId);
	};
};
