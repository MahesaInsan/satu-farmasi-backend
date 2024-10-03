import { Builder } from "builder-pattern";
import AddOutputMedicineRequest from "../../model/request/AddOutputMedicineRequest";
import EditOutputMedicineRequest from "../../model/request/EditOutputMedicineRequest";
import OutputMedicine from "../../entity/OutputMedicine";

export default class OutputMedicineHelper {

    public createOutputMedicine(request: AddOutputMedicineRequest): OutputMedicine {
        return Builder<OutputMedicine>()
            .medicineId(request.medicineId)
            .quantity(request.quantity)
            .reasonOfDispose(request.reasonOfDispose)
            //.reportId(request.reportId)
            .reportId(1)
            .is_active(true)
            .created_at(new Date())
            .build();
    }

    public editOutputMedicine(request: EditOutputMedicineRequest): OutputMedicine {
        return Builder<OutputMedicine>()
            .id(request.id)
            .id(request.id)
            .medicineId(request.medicineId)
            .quantity(request.quantity)
            .reasonOfDispose(request.reasonOfDispose)
            .reportId(request.reportId)
            .is_active(request.is_active || false)
            .updated_at(new Date())
            .build();
    }
}
