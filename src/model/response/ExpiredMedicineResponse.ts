import {ReasonOfDispose} from "@prisma/client";

export default interface ExpiredMedicineResponse {
    medicineId: number,
    medicineName: string,
    batchCode: string,
    currStock: number,
    quantity: number,
    expiredDate: Date,
    reasonOfDispose: ReasonOfDispose
}