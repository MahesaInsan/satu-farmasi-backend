export default class RangeMonthRequest {
    private _startDate: Date;
    private _lastDate: Date;

    constructor(startDate: Date, lastDate: Date) {
        this._startDate = startDate;
        this._lastDate = lastDate;
    }

    get startDate(): Date {
        return this._startDate;
    }

    get lastDate(): Date {
        return this._lastDate;
    }

    set startDate(date: Date) {
        this._startDate = date;
    }

    set lastDate(date: Date) {
        this._lastDate = date;
    }
}