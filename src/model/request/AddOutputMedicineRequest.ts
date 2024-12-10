import { ReasonOfDispose } from "@prisma/client";
import AddPhysicalReportRequest from "./AddPhysicalReportRequest";

export default class AddOutputMedicineRequest {
    private _medicineId: number;
    private _currStock: number;
    private _quantity: number;
    private _reasonOfDispose: ReasonOfDispose;
    private _reportId: number | null;
    private _physicalReportId: number;
    private _physicalReport: AddPhysicalReportRequest;

    constructor(medicineId: number, quantity: number, reasonOfDispose: ReasonOfDispose, reportId: number, _currStock: number, physicalReportId: number, physicalReport: AddPhysicalReportRequest) {
        this._medicineId = medicineId;
        this._quantity = quantity;
        this._reasonOfDispose = reasonOfDispose;
        this._reportId = reportId;
        this._currStock = _currStock;
        this._physicalReportId = physicalReportId;
        this._physicalReport = physicalReport;
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

    get currStock(): number {
        return this._currStock;
    }

    set currStock(value: number) {
        this._currStock = value;
    }

    get physicalReportId(): number {
        return this._physicalReportId;
    }

    set physicalReportId(value: number) {
        this._physicalReportId = value;
    }

    get physicalReport(): AddPhysicalReportRequest {
        return this._physicalReport;
    }

    set physicalReport(value: AddPhysicalReportRequest) {
        this._physicalReport = value;
    }
}
