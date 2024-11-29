import {Status, Prisma} from "@prisma/client";
import DraftMedicineListVO from "./DraftMedicineListVO";

export default interface DraftPrescriptionVO {
    id: number,
    status: Status
    patient: {
        id: number,
        name: string,
        credentialNumber: string,
        phoneNum: string
    },
    medicineList: DraftMedicineListVO[]
}