export default class AddMedicineReportRequest {
    private readonly _isFinalized: boolean;
    private readonly _created_at: Date;
    private readonly _is_active: boolean;

    constructor(isFinalized: boolean, is_active: boolean, created_at: Date) {
        this._isFinalized = isFinalized;
        this._is_active = is_active;
        this._created_at = created_at;
    }

    get isFinalized(): boolean {
        return this._isFinalized;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    get created_at(): Date {
        return this._created_at;
    }

    set is_active(value: boolean) {
        this.is_active = value;
    }

    set isFinalized(value: boolean) {
        this.isFinalized = value;
    }

    set created_at(value: Date) {
        this.created_at = value;
    }

}
