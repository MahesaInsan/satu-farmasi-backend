import {Status} from "@prisma/client";

export default interface SummaryDiagnoseVO {
    id: number
    title: string
    description: string
    prescription: {
        status: Status
        patient: {
            name: string
        }
    },
    is_active: boolean
    created_at: Date
}