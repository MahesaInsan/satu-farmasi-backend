import { Decimal } from "@prisma/client/runtime/library"

export default class GetMedicineRequest {
    private _code: string
    private _name: string
    private _merk: string

    constructor(code: string, name: string, merk: string) {
        this._code = code
        this._name = name
        this._merk = merk
    }

    get code(): string {
        return this._code
    }

    get name(): string {
        return this._name
    }

    get merk(): string {
        return this._merk
    }

    set code(code: string) {
        this._code = code
    }

    set name(name: string) {
        this._name = name
    }

    set merk(merk: string) {
        this._merk = merk
    }
}