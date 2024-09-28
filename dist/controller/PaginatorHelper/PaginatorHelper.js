"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaginatorHelper {
    paginate(page, limit, totalData) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = { startIndex, limit };
        if (endIndex < totalData) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        return result;
    }
}
exports.default = PaginatorHelper;
