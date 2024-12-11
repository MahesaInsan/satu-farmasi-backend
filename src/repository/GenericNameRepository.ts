import GenericName from "../entity/GenericName";
import GenericDropdownVO from "../model/VOs/GenericDropdownVO";
import BaseRepository from "./helper/BaseRepository";

export default class GenericNameRepository extends BaseRepository {
	constructor() {
		super();
	}
	public async getTotalGenericName(): Promise<number> {
		try {
			return await this.Prisma.genericName.count({
				orderBy: [
                    { is_active: "desc" },
					{ updated_at: "desc" },
					{ created_at: "desc" }
				],
			});
		} catch (error) {
			console.error("Error getting total generic name:", error);
			throw new Error("Failed to get total generic name");
		}
	}

	public async getTotalGenericNameByLabel(label: string): Promise<number> {
		try {
			return await this.Prisma.genericName.count({
				where: {
					label: {
						contains: label,
						mode: 'insensitive'
					},
				},
				orderBy: [
                    { is_active: "desc" },
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
			});
		} catch (error) {
			console.error("Error getting total generic name by label:", error);
			throw new Error("Failed to get total generic name by label");
		}
	}

	public async getAllGenericName(limit: number, startIndex: number): Promise<GenericName[]> {
		try {
			return await this.Prisma.genericName.findMany({
				orderBy: [
                    { is_active: "desc" },
					{ updated_at: "desc" },
					{ created_at: "desc" }
				],
				skip: startIndex,
				take: limit,
			});
		} catch (error) {
			console.error("Error getting all generic name:", error);
			throw new Error("Failed to get all generic name");
		}
	}

	public async getGenericNameDropdown(genericNameId?: number): Promise<GenericDropdownVO[]> {
		try {
			return await this.Prisma.genericName.findMany({
                where: {
                    OR: [
                        { is_active: true },
                        { id: genericNameId}
                    ]
                },
				select: {
					id: true,
					label: true,
					value: true
				}
			})
		} catch (error) {
			console.error("Error getting generic name dropdown:", error);
			throw new Error("Failed to get generic name dropdown");
		}
	}

	public async addGenericName(genericName: GenericName): Promise<boolean> {
		try {
			const data: GenericName = await this.Prisma.genericName.create({ data: genericName });
			return data !== null;
		} catch (error) {
			console.error("Error adding generci name:", error);
			throw new Error("Failed to add generic name");
		}
	}

	public async editGenericName(genericName: GenericName): Promise<boolean> {
		try {
			genericName.id = Number(genericName.id);
			await this.Prisma.genericName.update({
				where: { id: genericName.id },
				data: genericName,
			});
			return true;
		} catch (error) {
			console.error("Error updating generic name:", error);
			throw new Error("Failed to edit generic name");
		}
	}

	public async getGenericNameById(id: number): Promise<GenericName | null> {
		try {
			return await this.Prisma.genericName.findUnique({
				where: { id: id },
			});
		} catch (error) {
			console.error("Error getting generic name by id:", error);
			throw new Error("Failed to get generic name by id");
		}
	}

	public async getGenericNameByLabel(limit: number, startIndex: number, label: string): Promise<GenericName[]> {
		try {
			return await this.Prisma.genericName.findMany({
				where: {
					label: {
						contains: label,
						mode: 'insensitive'
					},
				},
				orderBy: [
                    { is_active: "desc" },
					{ updated_at: "desc" },
					{ created_at: "desc" }
				],
				skip: startIndex,
				take: limit,
			});
		} catch (error) {
			console.error("Error getting generic name by label:", error);
			throw new Error("Failed to get generic name by label");
		}
	}

	public async findIfExistByValueExceptById(value: string, id?: number): Promise<GenericName | null> {
		try {
			return await this.Prisma.genericName.findFirst({
				where: {
					value: {
						equals: value,
						mode: 'insensitive'
					},
					NOT: {
						id: id
					}
				}
			})
		} catch (error) {
			console.error("Error getting generic name by value:", error);
			throw new Error("Failed to get generic name by value");
		}
	}
}
