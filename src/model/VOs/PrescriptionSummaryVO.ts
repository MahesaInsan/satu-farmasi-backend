import {Status} from "@prisma/client";


export default interface PrescriptionSummaryVO {
    id: number;
    created_at: Date;
    patient: {
        id: number;
        name: string;
    }
    status: Status
}
