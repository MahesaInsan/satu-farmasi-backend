export default class EditPackagingRequest {
    private _id: number;
    private _label: string;
    private _value: string;
    private _isActive: boolean;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(id: number, label: string, value: string, isActive: boolean, createdAt: Date, updatedAt: Date) {
        this._id = id;
        this._label = label;
        this._value = value;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    public get id(): number {
        return this._id;
    }

    public set id(v: number) {
        this._id = v;
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

    public get isActive(): boolean {
        return this._isActive;
    }
    
    public set isActive(v: boolean) {
        this._isActive = v;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }
    
    public set createdAt(v: Date) {
        this._createdAt = v;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }
    
    public set updatedAt(v: Date) {
        this._updatedAt = v;
    }
}