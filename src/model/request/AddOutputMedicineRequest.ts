import { ReasonOfDispose } from "@prisma/client";

export default class AddOutputMedicineRequest {
    private _medicineId: number;
    private _quantity: number;
    private _reasonOfDispose: ReasonOfDispose;
    //private _reportId: number;

    //constructor(medicineId: number, quantity: number, reasonOfDispose: ReasonOfDispose, reportId: number) {
    //    this._medicineId = medicineId;
    //    this._quantity = quantity;
    //    this._reasonOfDispose = reasonOfDispose;
    //    this._reportId = reportId;
    //}

    constructor(medicineId: number, quantity: number, reasonOfDispose: ReasonOfDispose) {
        this._medicineId = medicineId;
        this._quantity = quantity;
        this._reasonOfDispose = reasonOfDispose;
    }

    get medicineId(): number {
        return this._medicineId;
    }

    set medicineId(value: number) {
        this._medicineId = value;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    get reasonOfDispose(): ReasonOfDispose {
        return this._reasonOfDispose;
    }

    set reasonOfDispose(value: ReasonOfDispose) {
        this._reasonOfDispose = value;
    }

    //get reportId(): number {
    //    return this._reportId;
    //}
    //
    //set reportId(value: number) {
    //    this._reportId = value;
    //}
}
