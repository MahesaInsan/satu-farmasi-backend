export default class DeleteReceiveMedicineRequest {
    private _id: number;

    constructor(id: number) {
        this._id = id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get id(): number {
        return this._id;
    }
}