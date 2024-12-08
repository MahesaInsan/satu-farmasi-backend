import { UnitOfMeasure } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import AddMedicineClassificationRequest from "./AddMedicineClassificationRequest";

export default class AddMedicineRequest {
    private _code: string;
    private _name: string;
    private _batchCode: string;
    private _genericNameId: number;
    private _merk: string;
    private _description: string;
    private _unitOfMeasure: UnitOfMeasure;
    private _price: Decimal;
    private _expiredDate: Date;
    private _packagingId: number;
    private _currStock: number;
    private _minStock: number;
    private _maxStock: number;
    private _sideEffect: string;
    private _classificationList: AddMedicineClassificationRequest[];
    
    constructor(
        code: string,
        name: string,
        batchCode: string,
        genericNameId: number,
        merk: string,
        description: string,
        unitOfMeasure: UnitOfMeasure,
        price: Decimal,
        expiredDate: Date,
        packagingId: number,
        currStock: number,
        minStock: number,
        maxStock: number,
        sideEffect: string,
        classificationList: AddMedicineClassificationRequest[]
    ) {
        this._code = code;
        this._name = name;
        this._batchCode = batchCode;
        this._genericNameId = genericNameId;
        this._merk = merk;
        this._description = description;
        this._unitOfMeasure = unitOfMeasure;
        this._price = price;
        this._expiredDate = expiredDate;
        this._packagingId = packagingId;
        this._currStock = currStock;
        this._minStock = minStock;
        this._maxStock = maxStock;
        this._sideEffect = sideEffect;
        this._classificationList = classificationList;
    }

    get code(): string {
        return this._code;
    }

    get name(): string {
        return this._name;
    }

    get batchCode(): string {
        return this._batchCode;
    }

    get genericNameId(): number {
        return this._genericNameId;
    }

    get merk(): string {
        return this._merk;
    }

    get description(): string {
        return this._description;
    }

    get unitOfMeasure(): UnitOfMeasure {
        return this._unitOfMeasure;
    }

    get price(): Decimal {
        return this._price;
    }

    get expiredDate(): Date {
        return this._expiredDate;
    }

    get packagingId(): number {
        return this._packagingId;
    }

    get currStock(): number {
        return this._currStock;
    }

    get minStock(): number {
        return this._minStock;
    }

    get maxStock(): number {
        return this._maxStock;
    }

    get sideEffect(): string {
        return this._sideEffect;
    }

    get classificationList(): AddMedicineClassificationRequest[] {
        return this._classificationList;
    }

    set code(code: string) {
        this._code = code;
    }

    set name(name: string) {
        this._name = name;
    }

    set batchCode(batchCode: string) {
        this._batchCode = batchCode;
    }

    set genericNameId(genericNameId: number) {
        this._genericNameId = genericNameId;
    }

    set merk(merk: string) {
        this._merk = merk;
    }

    set description(description: string) {
        this._description = description;
    }

    set unitOfMeasure(unitOfMeasure: UnitOfMeasure) {
        this._unitOfMeasure = unitOfMeasure;
    }

    set price(price: Decimal) {
        this._price = price;
    }

    set expiredDate(expiredDate: Date) {
        this._expiredDate = expiredDate;
    }

    set packagingId(packagingId: number) {
        this._packagingId = packagingId;
    }

    set currStock(currStock: number) {
        this._currStock = currStock;
    }

    set minStock(minStock: number) {
        this._minStock = minStock;
    }

    set maxStock(maxStock: number) {
        this._maxStock = maxStock;
    }

    set sideEffect(sideEffect: string) {
        this._sideEffect = sideEffect;
    }

    set classificationList(classificationList: AddMedicineClassificationRequest[]) {
        this._classificationList = classificationList;
    }
}