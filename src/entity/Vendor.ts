import BaseEntity from "./BaseEntity";

export default class Vendor extends BaseEntity {
    public name: string;
    public phoneNum: string;
    public address: string;
    public city: string;

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date, name: string, phoneNum: string, address: string, city: string) {
        super(id, is_active, created_at, updated_at);
        this.name = name;
        this.phoneNum = phoneNum;
        this.address = address;
        this.city = city;
    }
}