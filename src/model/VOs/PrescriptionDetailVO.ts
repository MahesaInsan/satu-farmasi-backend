import MedicineData from "./MedicineDropdownVO";
import {Prisma, Status} from "@prisma/client";

export default interface PrescriptionDetailVO {
    id: number,
    status: Status;
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