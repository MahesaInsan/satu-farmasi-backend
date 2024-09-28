"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = __importDefault(require("./BaseEntity"));
class GenericName extends BaseEntity_1.default {
    constructor(id, is_active, created_at, updated_at, value, label) {
        super(id, is_active, created_at, updated_at);
        this.label = label;
        this.value = value;
    }
}
exports.default = GenericName;
