import { Prisma } from "@prisma/client";

export default class EditPhysicalReportRequest {
    private _id: number;
    private _data: Prisma.JsonValue;

    constructor(id: number, data: Prisma.JsonObject) {
        this._id = id;
        this._data = data;
    }

    public get id(): number {
        return this._id;
    }

    public get data(): Prisma.JsonValue {
        return this._data;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set data(value: Prisma.JsonValue) {
        this._data = value;
    }
}