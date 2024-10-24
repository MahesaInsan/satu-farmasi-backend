import { Role } from "@prisma/client";

export default interface PharmacistVO {
	id: number,
	is_active: boolean,
	created_at: Date,
	updated_at: Date,
	nik: string,
	email: string,
	firstName: string,
	lastName: string,
	dob: Date,
	phoneNum: string,
	role: Role
}
