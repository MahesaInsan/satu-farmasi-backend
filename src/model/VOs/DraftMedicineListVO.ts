import {Prisma} from "@prisma/client";

export default interface DraftMedicineListVO {
    quantity: number,
    instruction: string,
    totalPrice: Prisma.Decimal
    medicineCode: string,
    medicineName: string | null
}