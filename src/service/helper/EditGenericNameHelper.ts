import { Builder } from "builder-pattern";
import EditGenericNameRequest from "../../model/request/editGenericNameRequest";
import {GenericName} from "@prisma/client";

export default class EditGenericNameHelper{

    public editGenericName(request: EditGenericNameRequest): GenericName{
        return Builder<GenericName>()
            .id(request.id)
            .label(request.label)
            .value(request.value)
            .updated_at(new Date())
            .build();
    }
}
