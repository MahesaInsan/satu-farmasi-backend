import { $Enums, Medicine, Prisma, Vendor } from "@prisma/client";
import AddMedicineRequest from "./AddMedicineRequest";

export default class AddReceiveMedicineRequest {
    private _documentNumber: string;
    private _batchCode: string;
    private _medicineId: number;
    private _quantity: number;
    private _vendorId: number;
    private _buyingPrice: Prisma.Decimal;
    private _paymentMethod: $Enums.PaymentMethod;
    private _deadline: Date;
    private _isPaid: boolean;
    private _medicineRequest: AddMedicineRequest;

    constructor(
        documentNumber: string,
        batchCode: string,
        medicineId: number,
        quantity: number,
        vendorId: number,
        buyingPrice: Prisma.Decimal,
        paymentMethod: $Enums.PaymentMethod,
        deadline: Date,
        isPaid: boolean,
        medicineRequest: AddMedicineRequest
    ) {
        this._documentNumber = documentNumber;
        this._batchCode = batchCode;
        this._medicineId = medicineId;
        this._quantity = quantity;
        this._vendorId = vendorId;
        this._buyingPrice = buyingPrice;
        this._paymentMethod = paymentMethod;
        this._deadline = deadline;
        this._isPaid = isPaid;
        this._medicineRequest = medicineRequest;
    }

    get documentNumber(): string {
        return this._documentNumber;
    }

    get batchCode(): string {
        return this._batchCode;
    }

    get medicineId(): number {
        return this._medicineId;
    }

    get quantity(): number {
        return this._quantity;
    }

    get vendorId(): number {
        return this._vendorId;
    }

    get buyingPrice(): Prisma.Decimal {
        return this._buyingPrice;
    }

    get paymentMethod(): $Enums.PaymentMethod {
        return this._paymentMethod;
    }

    get deadline(): Date {
        return this._deadline;
    }

    get isPaid(): boolean {
        return this._isPaid;
    }

    get medicineRequest(): AddMedicineRequest {
        return this._medicineRequest;
    }

    set documentNumber(value: string) {
        this._documentNumber = value;
    }

    set batchCode(value: string) {
        this._batchCode = value;
    }

    set medicineId(value: number) {
        this._medicineId = value;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    set vendorId(value: number) {
        this._vendorId = value;
    }

    set buyingPrice(value: Prisma.Decimal) {
        this._buyingPrice = value;
    }

    set paymentMethod(value: $Enums.PaymentMethod) {
        this._paymentMethod = value;
    }

    set deadline(value: Date) {
        this._deadline = value;
    }

    set isPaid(value: boolean) {
        this._isPaid = value;
    }

    set medicineRequest(value: AddMedicineRequest) {
        this._medicineRequest = value;
    }
}