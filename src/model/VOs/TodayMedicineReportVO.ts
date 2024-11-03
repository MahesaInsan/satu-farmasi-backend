export default interface MedicineReportVO {
    id: number;
    isFinalized: boolean;
    receiveMedicines: Array<any>;
    transactions: Array<any>;
    outputMedicines: Array<any>;
}
