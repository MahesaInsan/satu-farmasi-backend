import GenericName from "../entity/GenericName";
import { BaseValidation } from "./BaseValidation";
import { ValidationSchema } from "./helper/ValidationTypeHelper";

export default class GenericNameValidation extends BaseValidation {
    public createPackagingValidation() {
        const schema: ValidationSchema = GenericName.createSchema();
        return this.validateBodyData(schema);
    }

    public updatePackagingValidation() {
        const schema: ValidationSchema = GenericName.editSchema();
        return this.validateBodyData(schema);
    }

    public deletePackagingValidation() {
        const schema: ValidationSchema = GenericName.deleteSchema();
        return this.validateBodyData(schema);
    }
}
