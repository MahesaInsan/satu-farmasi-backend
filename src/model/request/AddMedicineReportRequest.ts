export default class AddMedicineReportRequest {
    private _isFinalized: boolean;
    private _is_active: boolean;

    constructor(isFinalized: boolean, is_active: boolean) {
        this._isFinalized = isFinalized;
        this._is_active = is_active;
    }

    get isFinalized(): boolean {
        return this._isFinalized;
    }

    set isFinalized(value: boolean) {
        this._isFinalized = value;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    set is_active(value: boolean) {
        this._is_active = value;
    }
}
