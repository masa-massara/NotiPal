import type { DestinationRepository } from "../../domain/repositories/destinationRepository";
export interface DeleteDestinationInput {
    id: string;
    userId: string;
}
export declare const createDeleteDestinationUseCase: (dependencies: {
    destinationRepository: DestinationRepository;
}) => (input: DeleteDestinationInput) => Promise<void>;
