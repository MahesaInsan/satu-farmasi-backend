import { Builder } from "builder-pattern";
import AddOutputMedicineRequest from "../../model/request/AddOutputMedicineRequest";
import EditOutputMedicineRequest from "../../model/request/EditOutputMedicineRequest";
import DeleteOutputMedicineRequest from "../../model/request/DeleteOutputMedicineRequest";
import { OutputMedicine } from "@prisma/client";
// import OutputMedicine from "../../entity/OutputMedicine";

export default class OutputMedicineHelper {

    public createOutputMedicine(request: AddOutputMedicineRequest): OutputMedicine {
        return Builder<OutputMedicine>()
            .medicineId(request.medicineId)
            .quantity(request.quantity)
            .reportId(request.reportId ?? null)
            .reasonOfDispose(request.reasonOfDispose)
            .is_active(true)
            .created_at(new Date())
            .physicalReportId(request.physicalReportId)
            .build();
    }

    public editOutputMedicine(request: EditOutputMedicineRequest): OutputMedicine {
        return Builder<OutputMedicine>()
            .id(request.id)
            .medicineId(request.medicineId)
            .quantity(request.quantity)
            .reasonOfDispose(request.reasonOfDispose)
            .reportId(request.reportId)
            .is_active(request.is_active || false)
            .updated_at(new Date())
            .physicalReportId(request.physicalReport.id)
            .build();
    }

    public deleteOutputMedicine(request: DeleteOutputMedicineRequest): OutputMedicine {
        return Builder<OutputMedicine>()
            .id(request.id)
            .build();
    }
}
