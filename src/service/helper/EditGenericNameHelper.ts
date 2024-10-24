import { Builder } from "builder-pattern";
import BaseEntity from "../../entity/BaseEntity";

export default class EditGenericNameHelper<U, T extends BaseEntity>{

    public editGenericName(request: U): T{
        return Builder<T>()
            .created_at(new Date())
            .updated_at(new Date())
            .build();
    }
}
