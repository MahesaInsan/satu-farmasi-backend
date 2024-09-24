import BaseEntity from "./BaseEntity"

export default class Packaging extends BaseEntity {
    public value: string;
    public label: string;

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date, value: string, label: string) {
        super(id, is_active, created_at, updated_at)
        this.label = label;
        this.value = value;
    }

    public static createSchema() {
        return {
            value: { isString: true },
            label: { isString: true },
        };
    }

    public static editSchema() {
        return {
            id: { isNumber: true },
            value: { isString: true },
            label: { isString: true },
        };
    }

    public static deleteSchema() {
        return {
            id: { isNumber: true },
            is_active: { isBoolean: true },
        };
    }
}
