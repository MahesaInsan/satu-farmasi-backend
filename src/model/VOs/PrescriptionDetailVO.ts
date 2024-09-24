import MedicineData from "./MedicineDropdownVO";
import {Prisma} from "@prisma/client";

export default interface PrescriptionDetailVO {
    id: number,
    patient: {
        id: number,
        name: string,
        credentialNumber: string
        phoneNum: string
    },
    medicineList: {
        quantity: number,
        instruction: string,
        totalPrice: Prisma.Decimal
        medicine: MedicineData
    }[],
}