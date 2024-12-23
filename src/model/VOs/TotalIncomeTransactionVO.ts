import { Prisma } from "@prisma/client"

export default interface TotalIncomeTransactionVO {
    totalPrice: Prisma.Decimal
}