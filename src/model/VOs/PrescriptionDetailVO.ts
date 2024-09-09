import MedicineData from "./MedicineDropdownVO";

export default interface PrescriptionDetailVO {
    id: number,
    patient: {
        name: string,
        credentialNumber: string
    },
    medicineList: {
        medicine: MedicineData
    }[]
}