import AddDiagnoseRequest from "../../model/request/AddDiagnoseRequest";
import DoctorService from "../DoctorService";
import AddPrescriptionRequest from "../../model/request/AddPrescriptionRequest";
import MedicineService from "../MedicineService";
import EditPrescriptionRequest from "../../model/request/EditPrescriptionRequest";
import MedicineData from "../../model/VOs/MedicineDropdownVO";
import PrescriptionHasMedicineRepository from "../../repository/PrescriptionHasMedicineRepository";
import {PrescriptionHasMedicine} from "@prisma/client";

export default class ValidationHelper {
    private readonly doctorService: DoctorService;
    private readonly medicineService: MedicineService;
    private readonly prescriptionHasMedicineRepository: PrescriptionHasMedicineRepository;

    constructor() {
        this.doctorService = new DoctorService();
        this.medicineService = new MedicineService();
        this.prescriptionHasMedicineRepository = new PrescriptionHasMedicineRepository();
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
        console.log("request: ", request)
        let prescriptionHasMedicine: PrescriptionHasMedicine[] = []
        let indexByMedicineCode: Map<string, number> = new Map<string, number>();
        const medicineListValidation: MedicineData[] = await this.medicineService.getMedicineValidationList(request.medicineList
            .map((medicine) => medicine.code))
        let quantityByMedicineCode: Map<string, number> = new Map<string, number>();

        if ((request as EditPrescriptionRequest).prescriptionId) {
           prescriptionHasMedicine = await this.prescriptionHasMedicineRepository.getPrescriptionHasMedicine((request as EditPrescriptionRequest).prescriptionId)
        }

        for (let i = 0; i < medicineListValidation.length; i++){
            indexByMedicineCode.set(medicineListValidation[i].code, i)
        }
        for (const phm of prescriptionHasMedicine) {
            console.log("phm: ", phm)
            if (quantityByMedicineCode.has(phm.medicineCode)) {
                quantityByMedicineCode.set(phm.medicineCode, quantityByMedicineCode.get(phm.medicineCode)! + phm.quantity)
            } else quantityByMedicineCode.set(phm.medicineCode, phm.quantity)
        }

        let medicineRequestList: string[]

        request.medicineList.forEach((medicineRequest) => {
            if (!indexByMedicineCode.has(medicineRequest.code)) {
                throw new Error("Medicine is not found")
            }
            if (medicineRequest.quantity < 1) {
                throw new Error("Quantity must be greater than 0")
            }

            const medicineValidation: MedicineData = medicineListValidation[indexByMedicineCode.get(medicineRequest.code)!]
            const medicineStockLeft = medicineValidation.currStock - medicineValidation.reservedStock

            if (medicineRequestList.includes(medicineRequest.code)) {
                throw new Error("Medicine chosen cannot be duplicate")
            } else medicineRequestList.push(medicineRequest.code)
            if (prescriptionHasMedicine.length === 0 && (medicineStockLeft - medicineRequest.quantity < 0)) {
                throw new Error("Insufficient medicine stock")
            }
            if (prescriptionHasMedicine.length > 0) {
                console.log("quantity: ", quantityByMedicineCode)
                const quantityAlreadyAssigned =
                    quantityByMedicineCode.get(medicineValidation.code) ? quantityByMedicineCode.get(medicineValidation.code)! : 0
                if (medicineValidation.currStock + quantityAlreadyAssigned - medicineRequest.quantity < 0) {
                    throw new Error("Insufficient medicine stock")
                }
            }
        })
    }
}
