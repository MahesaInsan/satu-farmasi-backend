import { Packaging, PrismaClient } from "@prisma/client";
import PackagingDropdownVO from "../model/VOs/PackagingDropdownVO";

export default class PackagingRepository {
	private readonly prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	public async createPackaging(dataPackaging: Packaging): Promise<boolean> {
		try {
			const packaging: Packaging = await this.prisma.packaging.create({ data: dataPackaging });
			return packaging !== null;
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalPackagings(): Promise<number> {
		try {
			return await this.prisma.packaging.count({
				orderBy: [
                    { is_active: 'desc' },
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
            });
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalPackagingsByLabel(label: string): Promise<number> {
		try {
			return await this.prisma.packaging.count({
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
			})
		} catch (error) {
			throw error as string;
		}
	}

	public async getAllPackagings(limit: number, startIndex: number): Promise<Packaging[]> {
		try {
			return await this.prisma.packaging.findMany({
				orderBy: [
                    { is_active: 'desc' },
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
				skip: startIndex,
				take: limit
			});
		} catch (error) {
			throw error as string;
		}
	}

	public async getPackagingsDropdown(): Promise<PackagingDropdownVO[]> {
		try {
			return await this.prisma.packaging.findMany({
				where: { is_active: true },
				select: {
					id: true,
					label: true,
					value: true
				}
			})
		} catch (error) {
			throw error as string;
		}
	}

	public async getPackagingById(id: number): Promise<Packaging | null> {
		try {
			return await this.prisma.packaging.findUnique({ where: { id: id, is_active: true } })
		} catch (error) {
			throw error as string;
		}
	}

	public async getPackagingByLabel(limit: number, startIndex: number, label: string): Promise<Packaging[]> {
		try {
			return await this.prisma.packaging.findMany({
				skip: startIndex,
				take: limit,
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
			})
		} catch (error) {
			throw error as string;
		}
	}

	public async isPackagingExist(label: string): Promise<boolean> {
		try {
			const packaging: Packaging | null = await this.prisma.packaging.findFirst({
				where: {
					label: label,
					is_active: true
				}
			});
			return packaging !== null;
		} catch (error) {
			throw error as string;
		}
	}

	public async editPackaging(dataPackaging: Packaging): Promise<boolean> {
		try {
			const packaging: Packaging = await this.prisma.packaging.update({
				where: { id: dataPackaging.id },
				data: dataPackaging
			});
			return packaging !== null;
		} catch (error) {
			throw error as string;
		}
	}
}
