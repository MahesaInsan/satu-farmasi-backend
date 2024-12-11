import { UnitOfMeasure } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import AddMedicineClassificationRequest from "./AddMedicineClassificationRequest";

export default class EditMedicineRequest {
    private _id: number;
    private _code: string;
    private _name: string;
    private _batchCode: string;
    private _genericNameId: number;
    private _merk: string;
    private _description: string;
    private _unitOfMeasure: UnitOfMeasure;
    private _price: Decimal;
    private _packagingId: number;
    private _minStock: number;
    private _maxStock: number;
    private _sideEffect: string;
    private _classificationList: AddMedicineClassificationRequest[];
    private _isActive: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    
    constructor(
        id: number,
        code: string,
        name: string,
        genericNameId: number,
        merk: string,
        batchCode: string,
        description: string,
        unitOfMeasure: UnitOfMeasure,
        price: Decimal,
        expiredDate: Date,
        packagingId: number,
        currStock: number,
        minStock: number,
        maxStock: number,
        sideEffect: string,
        classificationList: AddMedicineClassificationRequest[],
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        this._id = id;
        this._code = code;
        this._name = name;
        this._genericNameId = genericNameId;
        this._merk = merk;
        this._batchCode = batchCode;
        this._description = description;
        this._unitOfMeasure = unitOfMeasure;
        this._price = price;
        this._packagingId = packagingId;
        this._minStock = minStock;
        this._maxStock = maxStock;
        this._sideEffect = sideEffect;
        this._classificationList = classificationList;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    get id(): number {
        return this._id;
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

    get packagingId(): number {
        return this._packagingId;
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

    get isActive(): boolean {
        return this._isActive;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    set id(id: number) {
        this._id = id;
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

    set packagingId(packagingId: number) {
        this._packagingId = packagingId;
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

    set isActive(isActive: boolean) {
        this._isActive = isActive;
    }

    set createdAt(createdAt: Date) {
        this._createdAt = createdAt;
    }

    set updatedAt(updatedAt: Date) {
        this._updatedAt = updatedAt;
    }

    set classificationList(classificationList: AddMedicineClassificationRequest[]) {
        this._classificationList = classificationList;
    }
}