import {ReasonOfDispose} from "@prisma/client";

export default interface ExpiredMedicineResponse {
    medicineId: number,
    currStock: number,
    quantity: number,
    reasonOfDispose: ReasonOfDispose
}