import { Prisma } from "@prisma/client"

export default interface TotalOutcomeOutputVO {
    totalPrice: Prisma.Decimal
}