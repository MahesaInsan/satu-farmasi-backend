import { Prisma } from "@prisma/client";

export default interface PhysicalReportVO {
    id: number,
    data: Prisma.JsonValue,
    created_at: Date
}