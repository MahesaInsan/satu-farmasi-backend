import { Prisma } from "@prisma/client";

export default interface TransactionAnnualRecapVO {
    month: number,
    sales: number,
    revenue: Prisma.Decimal
}