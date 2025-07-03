// src/infrastructure/persistence/inMemory/inMemoryDestinationRepository.ts
import type { Destination as CommonDestination } from "@notipal/common"; // ドメイン層のエンティティ
import type { DestinationRepository } from "../../../domain/repositories/destinationRepository"; // ドメイン層のリポジフェース

export class InMemoryDestinationRepository implements DestinationRepository {
	private readonly destinations: CommonDestination[] = [];

	async save(destination: CommonDestination): Promise<void> {
		const existingIndex = this.destinations.findIndex(
			(d) => d.id === destination.id,
		);

		if (existingIndex > -1) {
			this.destinations[existingIndex] = destination;
		} else {
			this.destinations.push(destination);
		}
		return Promise.resolve();
	}

	async findById(
		id: string,
		userId: string,
	): Promise<CommonDestination | null> {
		const destination = this.destinations.find(
			(d) => d.id === id && d.userId === userId,
		);
		return Promise.resolve(destination || null);
	}

	async deleteById(id: string, userId: string): Promise<void> {
		const index = this.destinations.findIndex(
			(d) => d.id === id && d.userId === userId,
		);
		if (index > -1) {
			this.destinations.splice(index, 1);
		}
		return Promise.resolve();
	}

	async findAll(userId: string): Promise<CommonDestination[]> {
		const foundDestinations = this.destinations.filter(
			(d) => d.userId === userId,
		);
		return Promise.resolve([...foundDestinations]); // 配列のコピーを返す
	}

	// (テスト用、またはデバッグ用) 配列をクリアするメソッド
	clear(): void {
		this.destinations.length = 0;
	}
}
