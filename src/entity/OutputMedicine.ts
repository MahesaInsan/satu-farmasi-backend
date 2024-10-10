import { ReasonOfDispose } from "@prisma/client";
import BaseEntity from "./BaseEntity";

export default class OutputMedicine extends BaseEntity {
    private _medicineId: number;
    private _quantity: number;
    private _reasonOfDispose: ReasonOfDispose;
    private _reportId: number | null;

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date, medicineId: number, quantity: number, reasonOfDispose: ReasonOfDispose, reportId: number) {
        super(id, is_active, created_at, updated_at);
        this._medicineId = medicineId;
        this._quantity = quantity;
        this._reasonOfDispose = reasonOfDispose;
        this._reportId = reportId;
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

    get reportId(): number | null {
        return this._reportId;
    }

    set reportId(value: number) {
        this._reportId = value;
    }
}
