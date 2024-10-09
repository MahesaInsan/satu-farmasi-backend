import {Status} from "@prisma/client";

export default interface TransactionSummaryVO {
    id: number,
    patient: {
        name: string
    },
    pharmacist: {
        firstName: string
    },
    prescription: {
        status: Status
    },
    updated_at: Date
}