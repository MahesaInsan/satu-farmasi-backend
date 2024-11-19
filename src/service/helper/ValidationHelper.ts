import AddDiagnoseRequest from "../../model/request/AddDiagnoseRequest";
import DoctorService from "../DoctorService";
import AddPrescriptionRequest from "../../model/request/AddPrescriptionRequest";
import MedicineService from "../MedicineService";
import {Medicine} from "@prisma/client";
import EditPrescriptionRequest from "../../model/request/EditPrescriptionRequest";
import { CustomError } from "../../validator/helper/ErrorHelper";

export default class ValidationHelper {
    private readonly doctorService: DoctorService;
    private readonly medicineService: MedicineService;

    constructor() {
        this.doctorService = new DoctorService();
        this.medicineService = new MedicineService();
    }

    public async validateDiagnoseRequest(request: AddDiagnoseRequest) {
        if (!await this.doctorService.getDoctorById(request.doctorId)) {
            throw new Error("Doctor does not exist")
        }
        if (!request.title) {
            throw new Error("Title must not be empty")
        }
        if (!request.description) {
            throw new Error("Description must not be empty")
        }
        await this.validatePrescriptionRequest(request.prescription)
    }

    public async validatePrescriptionRequest(request: AddPrescriptionRequest | EditPrescriptionRequest) {
        const medicineListValidation: Medicine[] = await this.medicineService.getMedicineValidationList(request.medicineList
            .map((medicine) => medicine.medicineId))
        let indexByMedicineId: Map<number, number> = new Map<number, number>();
        for (let i = 0; i < medicineListValidation.length; i++){
            indexByMedicineId.set(medicineListValidation[i].id, i)
        }
        request.medicineList.forEach((medicineRequest, index) => {
            if (!indexByMedicineId.has(medicineRequest.medicineId)) {
                throw new Error("Medicine is not found")
            }
            if (medicineRequest.quantity < 1) {
                throw new Error("Quantity must be greater than 0")
            }
            const medicineValidation: Medicine = medicineListValidation[indexByMedicineId.get(medicineRequest.medicineId)!]
            console.log("curr stock medicine: ", medicineValidation.currStock)
            console.log("auntity", medicineRequest.quantity)
            if (medicineValidation.currStock - medicineRequest.quantity <= 0) {
                throw new CustomError().formatError("Insufficient medicine stock", `prescription.medicineList.${index}.quantity`);
            }
        })
    }
}
