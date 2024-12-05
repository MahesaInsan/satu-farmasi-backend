import Packaging from "../entity/Packaging";
import { BaseValidation } from "./BaseValidation";
import { ValidationSchema } from "./helper/ValidationTypeHelper";

export default class PackagingValidation extends BaseValidation {
    public createPackagingValidation() {
        const schema: ValidationSchema = Packaging.createSchema();
        return this.validateBodyData(schema);
    }

    public updatePackagingValidation() {
        const schema: ValidationSchema = Packaging.editSchema();
        return this.validateBodyData(schema);
    }

    public deletePackagingValidation() {
        const schema: ValidationSchema = Packaging.deleteSchema();
        return this.validateBodyData(schema);
    }
}
