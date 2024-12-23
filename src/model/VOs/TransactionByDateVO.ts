import { Prisma } from "@prisma/client";

export default interface TransactionByDateVO {
    id: number,
    prescriptionId: number,
    medicineId: number,
    medicineName: string,
    quantity: number,
    sellingPrice: Prisma.Decimal,
    totalPrice: Prisma.Decimal
}