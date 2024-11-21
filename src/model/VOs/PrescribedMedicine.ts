import {Prisma} from "@prisma/client";
import MedicineData from "./MedicineDropdownVO";

export default interface PrescribedMedicineVO {
    quantity: number,
    instruction: string,
    totalPrice: Prisma.Decimal
    medicineCode: string
    medicine: MedicineData
}