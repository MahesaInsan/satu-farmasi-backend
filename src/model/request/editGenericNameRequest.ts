export default class EditGenericNameRequest {
    private _id: number;
    private _label: string;
    private _value: string;

    constructor(id: number, label: string, value: string) {
        this._id = id;
        this._label = label;
        this._value = value;
    }

    get label(): string {
        return this._label;
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
}