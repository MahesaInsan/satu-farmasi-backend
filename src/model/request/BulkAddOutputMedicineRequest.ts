import AddPhysicalReportRequest from "./AddPhysicalReportRequest";
import OutputMedicineDataRequest from "./OutputMedicineDataRequest";

export default interface BulkAddOutputMedicineRequest {
    medicineList: OutputMedicineDataRequest[],
    physicalReport: AddPhysicalReportRequest
}