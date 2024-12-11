export default class TransactionAnnualRecapRequest {
    private _year: number;

    constructor(year: number) {
        this._year = year;
    }

    public set year(value: number) {
        this._year = value;
    }

    public get year(): number {
        return this._year;
    }
}