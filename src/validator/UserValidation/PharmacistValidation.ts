import Pharmacist from "../../entity/Pharmacist";
import { BaseValidation } from "../BaseValidation";
import { ValidationSchema } from "../helper/ValidationTypeHelper";

export default class PharmacistValidation extends BaseValidation {
    public createPharmacistValidation() {
        const schema: ValidationSchema = Pharmacist.addSchema();
        return this.validateBodyData(schema);
    }

    public updatePharmacistValidation() {
        const schema: ValidationSchema = Pharmacist.updateSchema();
        return this.validateBodyData(schema);
    }
}
