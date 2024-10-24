import { Doctor } from "@prisma/client";
import BaseRepository from "./helper/BaseRepository";
import DoctorVO from "../model/VOs/DoctorVO";
// import Doctor from "../entity/Doctor";

export default class DoctorRepository extends BaseRepository {
	constructor() {
		super();
	}

	public async emailIsExist(email: string): Promise<Boolean> {
		try {
			const doctor = await this.Prisma.doctor.findUnique({ where: { email: email } });
			return doctor !== null;
		} catch (error) {
			console.error('Error checking email:', error);
			throw new Error('Failed to check email');
		}
	}

	public async addDoctor(doctor: Doctor): Promise<Doctor> {
		try {
			return await this.Prisma.doctor.create({ data: doctor })
		} catch (error) {
			console.error('Error adding admin:', error);
			throw new Error('Failed to add admin');
		}
	}

	public async getDoctorByEmail(email: string): Promise<Doctor | null> {
		try {
			return await this.Prisma.doctor.findUnique({ where: { email: email } });
		} catch (error) {
			console.error('Error getting doctor by email:', error);
			throw new Error('Failed to get doctor');
		}
	}

	public async getTotalDoctor(param?: string): Promise<number> {
		try {
			return await this.Prisma.doctor.count({
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
				]
			});
		} catch (error) {
			console.log('Error getting total doctor:', error);
			throw new Error('Failed to get total doctor');
		}
	}

	public async getAllDoctors(limit: number, startIndex: number, param?: string): Promise<DoctorVO[]> {
		try {
			return await this.Prisma.doctor.findMany({
				omit: { password: true },
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
				skip: startIndex,
				take: limit,
			});
		} catch (error) {
			console.error('Error getting all doctor:', error);
			throw new Error('Failed to get doctor');
		}
	}

	public async getDoctorById(id: number): Promise<DoctorVO | null> {
		try {
			return await this.Prisma.doctor.findUnique({
				omit: { password: true },
				where: { id: id }
			});
		} catch (error) {
			console.error('Error getting doctor by id:', error);
			throw new Error('Failed to get doctor');
		}
	}

	public async getDoctorByNik(nik: string): Promise<DoctorVO | null> {
		try {
			return await this.Prisma.doctor.findUnique({
				omit: { password: true },
				where: { nik: nik }
			});
		} catch (error) {
			console.error('Error getting doctor by nik:', error);
			throw new Error('Failed to get doctor');
		}
	}

	public async editDoctor(doctor: Doctor): Promise<boolean> {
		try {
			const editedDoctor: DoctorVO = await this.Prisma.doctor.update({
				omit: { password: true },
				where: { nik: doctor.nik },
				data: doctor
			});
			console.log("editedData: ", editedDoctor)
			return editedDoctor !== null;
		} catch (error) {
			console.error('Error editing doctor:', error);
			throw new Error('Failed to edit doctor');
		}
	}
}
