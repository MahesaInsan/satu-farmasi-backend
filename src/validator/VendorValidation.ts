import Vendor from "../entity/Vendor";
import { BaseValidation } from "./BaseValidation";
import { ValidationSchema } from "./helper/ValidationTypeHelper";

export default class VendorValidation extends BaseValidation {
    public createVendorValidation() {
        const schema: ValidationSchema = Vendor.createSchema();
        return this.validateBodyData(schema);
    }

    public editVendorValidation() {
        const schema: ValidationSchema = Vendor.editSchema();
        return this.validateBodyData(schema);
    }

    public deleteVendorValidation() {
        const schema: ValidationSchema = Vendor.deleteSchema();
        return this.validateBodyData(schema);
    }
}
