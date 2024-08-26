import { Classification } from "@prisma/client";
import AddClassificationRequest from "../../model/request/AddClassificationRequest";
import { Builder } from "builder-pattern";
import EditClassificationRequest from "../../model/request/EditClassificationRequest";

export default class ClassificationHelper {
    public createClassification(request: AddClassificationRequest): Classification {
        return Builder<Classification>()
            .label(request.label)
            .value(request.value)
            .is_active(true)
            .created_at(new Date())
            .build();
    }

    public editClassification(request: EditClassificationRequest): Classification {
        return Builder<Classification>()
            .id(request.id)
            .label(request.label)
            .value(request.value)
            .is_active(request.isActive)
            .created_at(new Date())
            .build();
    }
}
