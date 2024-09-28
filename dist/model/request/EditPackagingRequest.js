"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditPackagingRequest {
    constructor(id, label, value, isActive, createdAt, updatedAt) {
        this._id = id;
        this._label = label;
        this._value = value;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }
    get id() {
        return this._id;
    }
    set id(v) {
        this._id = v;
    }
    get label() {
        return this._label;
    }
    set label(v) {
        this._label = v;
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
    }
    get isActive() {
        return this._isActive;
    }
    set isActive(v) {
        this._isActive = v;
    }
    get createdAt() {
        return this._createdAt;
    }
    set createdAt(v) {
        this._createdAt = v;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    set updatedAt(v) {
        this._updatedAt = v;
    }
}
exports.default = EditPackagingRequest;
