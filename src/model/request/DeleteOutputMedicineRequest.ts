export default class DeleteOutputMedicineRequest {
    private _id: number;
    private _medicineId: number;
    private _quantity: number;

    constructor(id: number, medicineId: number, quantity: number) {
        this._id = id;
        this._medicineId = medicineId;
        this._quantity = quantity;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get medicineId(): number {
        return this._medicineId;
    }

    set medicineId(value: number) {
        this._medicineId = value;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

}
