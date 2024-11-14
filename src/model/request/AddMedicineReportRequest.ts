export default class AddMedicineReportRequest {
    private readonly _isFinalized: boolean;
    private readonly _is_active: boolean;

    constructor(isFinalized: boolean, is_active: boolean) {
        this._isFinalized = isFinalized;
        this._is_active = is_active;
    }

    get isFinalized(): boolean {
        return this._isFinalized;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    set is_active(value: boolean) {
        this.is_active = value;
    }

    set isFinalized(value: boolean) {
        this.isFinalized = value;
    }

}
