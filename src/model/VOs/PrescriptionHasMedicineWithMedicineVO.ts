export default interface PrescriptionHasMedicineWithMedicineVO {
    id: number,
    medicine: {
        id: number,
        code: string,
        currStock: number
    }
}