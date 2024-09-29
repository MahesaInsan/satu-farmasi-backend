import BaseEntity from "./BaseEntity"

export default class MedicineReport extends BaseEntity {
    private _isFinalized: Boolean;

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date, isFinalized: Boolean) {
        super(id, is_active, created_at, updated_at)
        this._isFinalized = isFinalized;
    }

    set isFinalized(isFinalized: Boolean) {
        this._isFinalized = isFinalized;
    }

    get isFinalized(): Boolean {
        return this._isFinalized;
    }

}
