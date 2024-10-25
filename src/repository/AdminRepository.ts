// import Admin from "../entity/Admin";
import { Admin } from "@prisma/client";
import BaseRepository from "./helper/BaseRepository";
import AdminVO from "../model/VOs/AdminVO";
import { CustomError } from "../validator/helper/ErrorHelper";

export default class AdminRepository extends BaseRepository {
	constructor() {
		super();
	}

	public async nikIsExist(nik: string): Promise<Boolean> {
		try {
			const admin = await this.Prisma.admin.findUnique({
				where: { nik: nik },
				select: { nik: true }
			});
			return admin !== null;
		} catch (error) {
			console.error('Error checking nik:', error);
			throw new Error('Failed to check nik');
		}
	}

	public async emailIsExist(email: string): Promise<Boolean> {
		try {
			const admin = await this.Prisma.admin.findUnique({
				where: { email: email },
				select: { email: true }
			});
			return admin !== null;
		} catch (error) {
			console.error('Error checking email:', error);
			throw new Error('Failed to check email');
		}
	}

	public async addAdmin(admin: Admin): Promise<Admin> {
		try {
			return await this.Prisma.admin.create({ data: admin });
		} catch (error) {
			throw new CustomError().handlePrismaError(error, 'Failed to add admin');
		}
	}

	public async getAdminByEmail(email: string): Promise<Admin | null> {
		try {
			return await this.Prisma.admin.findUnique({ where: { email: email }, });
		} catch (error) {
			console.error("Error getting admin by email:", error);
			throw new Error("Failed to get admin");
		}
	}

	public async getTotalAdmin(param?: string): Promise<number> {
		try {
			return await this.Prisma.admin.count({
				where: {
					AND: [
						{
							is_active: true,
							OR: [
								{ firstName: { contains: param } },
								{ lastName: { contains: param } }
							]
						}
					]
				},
				orderBy: [
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
			});
		} catch (error) {
			console.log("Error getting total admins:", error);
			throw new Error("Failed to get total admins");
		}
	}


	public async getAllAdmins(limit: number, startIndex: number, param?: string): Promise<AdminVO[]> {
		try {
			return await this.Prisma.admin.findMany({
				omit: { password: true },
				where: {
					AND: [
						{
							is_active: true,
							OR: [
								{
									firstName: {
										contains: param,
										mode: 'insensitive'
									}
								},
								{
									lastName: {
										contains: param,
										mode: 'insensitive'
									}
								}
							]
						}
					]
				},
				orderBy: [
					{ updated_at: 'desc' },
					{ created_at: 'desc' },
				],
				skip: startIndex,
				take: limit,
			});
		} catch (error) {
			console.error("Error getting all admins:", error);
			throw new Error("Failed to add admin");
		}
	}

	public async getAdminById(id: number): Promise<AdminVO | null> {
		try {
			return await this.Prisma.admin.findUnique({
				omit: { password: true },
				where: { id: id }
			});
		} catch (error) {
			console.error('Error getting admin by id:', error);
			throw new Error('Failed to get admin');
		}
	}

	public async getAdminByNik(nik: string): Promise<AdminVO | null> {
		try {
			return await this.Prisma.admin.findUnique({
				omit: { password: true },
				where: { nik: nik }
			});
		} catch (error) {
			console.error('Error getting admin by nik:', error);
			throw new Error('Failed to get admin');
		}
	}

	public async editAdmin(admin: Admin): Promise<boolean> {
		try {
			const editedAdmin: AdminVO = await this.Prisma.admin.update({
				omit: { password: true },
				where: { nik: admin.nik }, data: admin
			});
			return editedAdmin !== null;
		} catch (error) {
			throw new CustomError().handlePrismaError(error, 'Failed to edit admin');
		}
	}
}
