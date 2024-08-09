import { Builder } from "builder-pattern";
import BaseEntity from "../../entity/BaseEntity";

export default class CreateMedicineHelper<U, T extends BaseEntity>{

    public createGenericName(request: U): T{
        return Builder<T>()
            .created_at(new Date())
            .updated_at(new Date())
            .build();
    }
}