import { NextFunction, Request, Response } from "express";
import Admin from "../../entity/Admin";
import { BaseValidation } from "../BaseValidation";
import { ValidationSchema } from "../helper/ValidationTypeHelper";
import DoctorValidation from "./DoctorValidation";
import PharmacistValidation from "./PharmacistValidation";
import test from "node:test";
import BaseController from "../../controller/BaseController";

export default class AdminValidation extends BaseValidation {
    private readonly doctorValidation: DoctorValidation;
    private readonly pharmacistValidation: PharmacistValidation;
    private readonly baseController: BaseController;

    constructor() {
        super();
        this.doctorValidation = new DoctorValidation();
        this.pharmacistValidation = new PharmacistValidation();
        this.baseController = new BaseController();
    }

    public createAdminValidation() {
        const schema: ValidationSchema = Admin.createSchema();
        return this.validateBodyData(schema);
    }

    public updateStaffValidation(req: Request) {
        const { role } = req.body;
            if (role.toLowerCase() === 'admin') {
               return this.updateAdminValidation();
            } else if (role.toLowerCase() === 'docter') {
                return this.doctorValidation.updateDoctorValidaiton();
            } else {
                return this.pharmacistValidation.updatePharmacistValidation();
            }
    }

    private updateAdminValidation() {
        const schema = Admin.updateSchema();
        return this.validateBodyData(schema);
    }

}
