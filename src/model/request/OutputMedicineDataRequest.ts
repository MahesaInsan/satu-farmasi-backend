import {ReasonOfDispose} from "@prisma/client";

export default interface OutputMedicineDataRequest {
    medicineId: number
    currStock: number
    quantity: number
    reasonOfDispose: ReasonOfDispose
}