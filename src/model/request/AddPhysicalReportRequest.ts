import { Prisma } from "@prisma/client";

export default class AddPhysicalReportRequest {
    private _id: number;
    private _data: Prisma.JsonValue;
    private _created_at: Date;

    constructor(id: number, data: Prisma.JsonObject, created_at: Date) {
        this._id = id;
        this._data = data;
        this._created_at = created_at
    }

    public get id(): number {
        return this._id;
    }

    public get data(): Prisma.JsonValue {
        return this._data;
    }

    public get createdAt(): Date {
        return this._created_at;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set data(value: Prisma.JsonValue) {
        this._data = value;
    }

    public set createdAt(value: Date) {
        this._created_at = value;
    }
}