import { Decimal } from "@prisma/client/runtime/library";

export default interface MedicineCheckStockVO {
    isReady: boolean;
    flag: number;
}