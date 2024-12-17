import { $Enums, Prisma } from "@prisma/client";

export default class EditReceiveMedicineRequest {
    private _id: number;
    private _documentNumber: string;
    private _batchCode: string;
    private _medicineId: number;
    private _quantity: number;
    private _vendorId: number;
    private _buyingPrice: Prisma.Decimal;
    private _paymentMethod: $Enums.PaymentMethod;
    private _deadline: Date;
    private _isArrived: boolean;
    private _is_active: boolean;
    private _reportId: number;
    private _expiredDate: Date;

    constructor(
        id: number,
        documentNumber: string,
        batchCode: string,
        medicineId: number,
        quantity: number,
        vendorId: number,
        buyingPrice: Prisma.Decimal,
        paymentMethod: $Enums.PaymentMethod,
        deadline: Date,
        isArrived: boolean,
        is_active: boolean,
        reportId: number,
        expiredDate: Date,
    ) {
        this._id = id;
        this._documentNumber = documentNumber;
        this._batchCode = batchCode;
        this._medicineId = medicineId;
        this._quantity = quantity;
        this._vendorId = vendorId;
        this._buyingPrice = buyingPrice;
        this._paymentMethod = paymentMethod;
        this._deadline = deadline;
        this._isArrived = isArrived;
        this._is_active = is_active;
        this._reportId = reportId;
        this._expiredDate = expiredDate;
    }

    // Getter and Setter for _id
    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    // Getter and Setter for _documentNumber
    public get documentNumber(): string {
        return this._documentNumber;
    }

    public set documentNumber(value: string) {
        this._documentNumber = value;
    }

    // Getter and Setter for _batchCode
    public get batchCode(): string {
        return this._batchCode;
    }

    public set batchCode(value: string) {
        this._batchCode = value;
    }

    // Getter and Setter for _medicineId
    public get medicineId(): number {
        return this._medicineId;
    }

    public set medicineId(value: number) {
        this._medicineId = value;
    }

    // Getter and Setter for _quantity
    public get quantity(): number {
        return this._quantity;
    }

    public set quantity(value: number) {
        this._quantity = value;
    }

    // Getter and Setter for _vendorId
    public get vendorId(): number {
        return this._vendorId;
    }

    public set vendorId(value: number) {
        this._vendorId = value;
    }

    // Getter and Setter for _buyingPrice
    public get buyingPrice(): Prisma.Decimal {
        return this._buyingPrice;
    }

    public set buyingPrice(value: Prisma.Decimal) {
        this._buyingPrice = value;
    }

    // Getter and Setter for _paymentMethod
    public get paymentMethod(): $Enums.PaymentMethod {
        return this._paymentMethod;
    }

    public set paymentMethod(value: $Enums.PaymentMethod) {
        this._paymentMethod = value;
    }

    // Getter and Setter for _deadline
    public get deadline(): Date {
        return this._deadline;
    }

    public set deadline(value: Date) {
        this._deadline = value;
    }

    // Getter and Setter for _isArrived
    public get isArrived(): boolean {
        return this._isArrived;
    }

    public set isArrived(value: boolean) {
        this._isArrived = value;
    }

    // Getter and Setter for _is_active
    public get is_active(): boolean {
        return this._is_active;
    }

    public set is_active(value: boolean) {
        this._is_active = value;
    }

    // Getter and Setter for _reportId
    public get reportId(): number {
        return this._reportId;
    }

    public set reportId(value: number) {
        this._reportId = value;
    }

    // Getter and Setter for _expiredDate
    public get expiredDate(): Date {
        return this._expiredDate;
    }

    public set expiredDate(value: Date) {
        this._expiredDate = value;
    }
}
