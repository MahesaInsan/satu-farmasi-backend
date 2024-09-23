import Doctor from "../../entity/Doctor";
import { BaseValidation } from "../BaseValidation";
import { ValidationSchema } from "../helper/ValidationTypeHelper";

export default class DoctorValidation extends BaseValidation {
    public createDoctorValidation() {
        const schema: ValidationSchema = Doctor.createSchema();
        return this.validateBodyData(schema);
    }

    public updateDoctorValidaiton() {
        const schema: ValidationSchema = Doctor.updateSchema();
        return this.validateBodyData(schema);
    }

    public deleteValidation() {
        const schema: ValidationSchema = Doctor.deleteSchema();
        return this.validateBodyData(schema);
    }
}
