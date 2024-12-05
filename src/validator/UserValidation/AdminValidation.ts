import Admin from "../../entity/Admin";
import { BaseValidation } from "../BaseValidation";
import { ValidationSchema } from "../helper/ValidationTypeHelper";
import DoctorValidation from "./DoctorValidation";
import PharmacistValidation from "./PharmacistValidation";

export default class AdminValidation extends BaseValidation {
	private readonly doctorValidation: DoctorValidation;
	private readonly pharmacistValidation: PharmacistValidation;

	constructor() {
		super();
		this.doctorValidation = new DoctorValidation();
		this.pharmacistValidation = new PharmacistValidation();
	}

	public createAdminValidation() {
		const schema: ValidationSchema = Admin.createSchema();
		return this.validateBodyData(schema);
	}

	public updateAdminValidation() {
		const schema = Admin.updateSchema();
		return this.validateBodyData(schema);
	}

	public updateDoctorValidation() {
		return this.doctorValidation.updateDoctorValidaiton();
	}

	public updatePharmacistValidation() {
		return this.pharmacistValidation.updatePharmacistValidation();
	}

}
