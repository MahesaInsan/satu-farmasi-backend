import Classification from "../entity/Classification";
import { BaseValidation } from "./BaseValidation";
import { ValidationSchema } from "./helper/ValidationTypeHelper";

export default class ClassificationValidation extends BaseValidation {
    public createClassificationValidation() {
        const schema: ValidationSchema = Classification.createSchema();
        return this.validateBodyData(schema);
    }

    public updateClassificationValidation() {
        const schema: ValidationSchema = Classification.editSchema();
        return this.validateBodyData(schema);
    }

    public deleteClassificationValidation() {
        const schema: ValidationSchema = Classification.deleteSchema();
        return this.validateBodyData(schema);
    }
}
