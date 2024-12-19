import { Builder } from "builder-pattern";
import AddMedicineReportRequest from "../../model/request/AddMedicineReportRequest";
import { MedicineReport } from "@prisma/client";

export default class MedicineReportHelper {

    public createMedicineReport(request: AddMedicineReportRequest): MedicineReport {
        return Builder<MedicineReport>()
            .isFinalized(request.isFinalized)
            .is_active(true)
            .created_at(request.created_at || new Date())
            .updated_at(request.created_at || new Date()) // Just for seeding purpose
            .build();
    }

}
