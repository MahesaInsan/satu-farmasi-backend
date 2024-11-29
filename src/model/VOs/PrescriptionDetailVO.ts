import {Prisma, Status} from "@prisma/client";
import PrescribedMedicineVO from "./PrescribedMedicine";

export default interface PrescriptionDetailVO {
    id: number,
    status: Status,
    medicineCode: string,
    patient: {
        id: number,
        name: string,
        credentialNumber: string
        phoneNum: string
    },
    medicineList: PrescribedMedicineVO[]
}