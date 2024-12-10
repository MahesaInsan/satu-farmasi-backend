import PrescriptionDetailVO from "../VOs/PrescriptionDetailVO";
import DraftPrescriptionVO from "../VOs/DraftPrescriptionVO";

export default interface DiagnoseDetailResponse {
    id: number,
    title: string,
    description: string,
    created_at: Date,
    prescription: PrescriptionDetailVO | DraftPrescriptionVO
}