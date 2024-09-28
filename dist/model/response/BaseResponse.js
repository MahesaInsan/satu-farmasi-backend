"use strict";
//CURRENTLY UNUSED SAVED FOR LATTER BUT MIGHT BE DELETED
Object.defineProperty(exports, "__esModule", { value: true });
class BaseResponse {
    constructor(code, status, message, data) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.data = data;
    }
    ok(data, message) {
        return new BaseResponse(200, "OK", message, data);
    }
    badRequest(message) {
        return new BaseResponse(400, "Bad Request", message, undefined);
    }
}
exports.default = BaseResponse;
