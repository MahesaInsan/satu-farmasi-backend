import {Status, Prisma} from "@prisma/client";

export default interface TransactionDetailVO {
    id: number,
    totalPrice: Prisma.Decimal,
    pharmacist: {
        firstName: string,
        lastName: string
    },
    prescription: {
        status: Status,
        patient: {
            credentialNumber: string
            name: string
        },
        medicineList: {
            quantity: number,
            instruction: string,
            totalPrice: Prisma.Decimal,
            medicine: {
                name: string,
                price: Prisma.Decimal
            }
        }[]
    }
}