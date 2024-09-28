"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditMedicineRequest {
    constructor(id, code, name, genericNameId, merk, description, unitOfMeasure, price, expiredDate, packagingId, currStock, minStock, maxStock, sideEffect, classificationList, isActive, createdAt, updatedAt) {
        this._id = id;
        this._code = code;
        this._name = name;
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
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }
    get id() {
        return this._id;
    }
    get code() {
        return this._code;
    }
    get name() {
        return this._name;
    }
    get genericNameId() {
        return this._genericNameId;
    }
    get merk() {
        return this._merk;
    }
    get description() {
        return this._description;
    }
    get unitOfMeasure() {
        return this._unitOfMeasure;
    }
    get price() {
        return this._price;
    }
    get expiredDate() {
        return this._expiredDate;
    }
    get packagingId() {
        return this._packagingId;
    }
    get currStock() {
        return this._currStock;
    }
    get minStock() {
        return this._minStock;
    }
    get maxStock() {
        return this._maxStock;
    }
    get sideEffect() {
        return this._sideEffect;
    }
    get classificationList() {
        return this._classificationList;
    }
    get isActive() {
        return this._isActive;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    set id(id) {
        this._id = id;
    }
    set code(code) {
        this._code = code;
    }
    set name(name) {
        this._name = name;
    }
    set genericNameId(genericNameId) {
        this._genericNameId = genericNameId;
    }
    set merk(merk) {
        this._merk = merk;
    }
    set description(description) {
        this._description = description;
    }
    set unitOfMeasure(unitOfMeasure) {
        this._unitOfMeasure = unitOfMeasure;
    }
    set price(price) {
        this._price = price;
    }
    set expiredDate(expiredDate) {
        this._expiredDate = expiredDate;
    }
    set packagingId(packagingId) {
        this._packagingId = packagingId;
    }
    set currStock(currStock) {
        this._currStock = currStock;
    }
    set minStock(minStock) {
        this._minStock = minStock;
    }
    set maxStock(maxStock) {
        this._maxStock = maxStock;
    }
    set sideEffect(sideEffect) {
        this._sideEffect = sideEffect;
    }
    set isActive(isActive) {
        this._isActive = isActive;
    }
    set createdAt(createdAt) {
        this._createdAt = createdAt;
    }
    set updatedAt(updatedAt) {
        this._updatedAt = updatedAt;
    }
    set classificationList(classificationList) {
        this._classificationList = classificationList;
    }
}
exports.default = EditMedicineRequest;
