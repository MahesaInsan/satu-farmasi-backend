import {Status} from "@prisma/client";


export default interface PrescriptionSummaryVO {
    id: number;
    created_at: Date;
    patient: {
        name: string;
    }
    status: Status
}