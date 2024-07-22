import {Prisma} from "@prisma/client"

export default class AddPrescribedMedicineRequest{
    private _medicineId: number
    private _price: Prisma.Decimal
    private _quantity: number
    private _instruction: string

    constructor(medicineId: number, price: Prisma.Decimal, quantity: number, instruction: string) {
        this._medicineId = medicineId;
        this._price = price;
        this._quantity = quantity;
        this._instruction = instruction;
    }

    get medicineId(): number {
        return this._medicineId;
    }

    set medicineId(value: number) {
        this._medicineId = value;
    }

    get price(): Prisma.Decimal {
        return this._price;
    }

    set price(value: Prisma.Decimal) {
        this._price = value;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    get instruction(): string {
        return this._instruction;
    }

    set instruction(value: string) {
        this._instruction = value;
    }
}