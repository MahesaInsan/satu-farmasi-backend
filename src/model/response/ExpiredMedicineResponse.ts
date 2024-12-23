import {ReasonOfDispose} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export default interface ExpiredMedicineResponse {
    medicineId: number,
    medicineName: string,
    batchCode: string,
    merk: string,
    description: string,
    sideEffect: string,
    currStock: number,
    price: Decimal,
    unitOfMeasure: string,
    quantity: number,
    expiredDate: Date,
    reasonOfDispose: ReasonOfDispose
}
