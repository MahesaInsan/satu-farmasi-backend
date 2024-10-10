import { ReasonOfDispose } from "@prisma/client";

export default class EditOutputMedicineRequest {
    private _id: number;
    private _medicineId: number;
    private _oldQuantity: number;
    private _quantity: number;
    private _reasonOfDispose: ReasonOfDispose;
    private _reportId: number;
    private _is_active: boolean;

    constructor(id: number, medicineId: number, quantity: number, reasonOfDispose: ReasonOfDispose, reportId: number, is_active: boolean, oldQuantity: number) {
        this._id = id;
        this._medicineId = medicineId;
        this._quantity = quantity;
        this._reasonOfDispose = reasonOfDispose;
        this._reportId = reportId;
        this._is_active = is_active;
        this._oldQuantity = oldQuantity;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
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

    get reportId(): number {
        return this._reportId;
    }

    set reportId(value: number) {
        this._reportId = value;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    set is_active(value: boolean) {
        this._is_active = value;
    }

    get oldQuantity(): number {
        return this._oldQuantity;
    }

    set currStock(value: number) {
        this._oldQuantity = value;
    }
}
