import { ReasonOfDispose } from "@prisma/client";
import PhysicalReportVO from "./PhysicalReportVO";

export default interface OutputMedicineVO {
    id: number;
    quantity: number;
    reasonOfDispose: ReasonOfDispose;
    is_active: boolean;
    created_at: Date;
    medicine: {
        id: number;
        name: string;
    };
    report: {
        id: number;
        isFinalized: boolean,

    } | null;
    physicalReport: PhysicalReportVO | null;
}
