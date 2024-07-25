export default class AddPackagingRequest {
    private _label: string;
    private _value: string;

    constructor(label: string, value: string) {
        this._label = label;
        this._value = value;
    }

    public get label(): string {
        return this._label;
    }

    public set label(v: string) {
        this._label = v;
    }

    public get value(): string {
        return this._value;
    }
    
    public set value(v: string) {
        this._value = v;
    }
}