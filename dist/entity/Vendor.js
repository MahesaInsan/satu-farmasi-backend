"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = __importDefault(require("./BaseEntity"));
class Vendor extends BaseEntity_1.default {
    constructor(id, is_active, created_at, updated_at, name, phoneNum, address, city) {
        super(id, is_active, created_at, updated_at);
        this.name = name;
        this.phoneNum = phoneNum;
        this.address = address;
        this.city = city;
    }
}
exports.default = Vendor;
