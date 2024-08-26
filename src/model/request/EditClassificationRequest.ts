export default class EditClassificationRequest {
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

  get id(): number {
    return this._id;
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

    public get isActive(): boolean {
        return this._isActive;
    }
    
    public set isActive(v: boolean) {
        this._isActive = v;
    }
}
