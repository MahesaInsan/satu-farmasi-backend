import BaseEntity from "./BaseEntity"

export default class Classification extends BaseEntity {
    public value: string;
    public label: string;

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date, value: string, label: string) {
        super(id, is_active, created_at, updated_at)
        this.label = label;
        this.value = value;
    }
}
