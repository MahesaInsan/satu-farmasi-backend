import Classification from "../entity/Classification";
import BaseRepository from "./helper/BaseRepository";

export default class ClassificationRepository extends BaseRepository {
	constructor() {
		super();
	}

	public async getClassificationByLabel(limit: number, startIndex: number, label: string): Promise<Classification[]> {
		try {
			return await this.Prisma.classification.findMany({
				where: {
					label: {
						contains: label,
						mode: 'insensitive',
					},
				},
				orderBy: [
                    { is_active: 'desc' },
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
				skip: startIndex,
				take: limit
			});
		} catch (error) {
			console.error("Error getting classification by label:", error);
			throw new Error("Failed to get classification by label");
		}
	}

	public async getTotalClassificationByLabel(label: string): Promise<number> {
		try {
			return await this.Prisma.classification.count({
				where: {
					label: { 
						contains: label,
						mode: 'insensitive',
					},
				},
				orderBy: [
                    { is_active: 'desc' },
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
			});
		} catch (error) {
			console.error("Error getting total classification by label:", error);
			throw new Error("Failed to get total classification by label");
		}
	}

	public async getTotalClassifications(): Promise<number> {
		try {
			return await this.Prisma.classification.count({
                orderBy: [
                    { is_active: 'desc' },
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
                ]
			});
		} catch (error) {
			console.error("Error getting total classifications:", error);
			throw new Error("Failed to get total classifications");
		}
	}

	public async getAllClassifications(limit: number, startIndex: number): Promise<Classification[]> {
		try {
			return await this.Prisma.classification.findMany({
				orderBy: [
                    { is_active: 'desc' },
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
				skip: startIndex,
				take: limit
			})
		} catch (error) {
			console.error("Error getting all classifications:", error);
			throw new Error("Failed to get all classifications");
		}
	}

	public async getClassificationById(id: number): Promise<Classification | null> {
		try {
			return await this.Prisma.classification.findUnique({ where: { id: id, is_active: true } })
		} catch (error) {
			console.error("Error getting classification by id:", error);
			throw new Error("Failed to get classification by id");
		}
	}

	public async addClassification(classification: Classification): Promise<Classification> {
		try {
			return await this.Prisma.classification.create({
				data: {
					value: classification.value,
					label: classification.label,
					is_active: true,
					created_at: new Date(),
				}
			})
		} catch (error) {
			console.error("Error adding classification:", error);
			throw new Error("Failed to add classification");
		}
	}

	public async editClassification(classification: Classification): Promise<Classification> {
		try {
			return await this.Prisma.classification.update({
				where: { id: Number(classification.id) },
				data: {
					value: classification.value,
					label: classification.label,
					is_active: classification.is_active,
					updated_at: new Date(),
				}
			})
		} catch (error) {
			console.error("Error deleting classification:", error);
			throw new Error("Failed to delete classification");
		}
	}

	public async getClassificationsDropdown(): Promise<Classification[]> {
		try {
			return await this.Prisma.classification.findMany({
				where: { is_active: true },
				orderBy: [
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
			})
		} catch (error) {
			throw error as string;
		}
	}
}
