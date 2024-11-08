import {Status} from "@prisma/client";


export default interface ChangeTransactionStatusVO {
    transactionId: number,
    prescriptionId: number,
    status: Status
}