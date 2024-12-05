export default class EditGenericNameRequest {
    private _id: number;
    private _label: string;
    private _value: string;
    private _isActive: boolean;

    constructor(id: number, label: string, value: string, isActive: boolean) {
        this._id = id;
        this._label = label;
        this._value = value;
        this._isActive = isActive;
    }

    get label(): string {
        return this._label;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set label(value: string) {
        this._label = value;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }
}
