"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseEntity {
    constructor(id, is_active, created_at, updated_at) {
        this.id = id;
        this.is_active = is_active;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
exports.default = BaseEntity;
