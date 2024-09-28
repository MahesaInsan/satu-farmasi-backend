"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_pattern_1 = require("builder-pattern");
class VendorHelper {
    createVendor(request) {
        return (0, builder_pattern_1.Builder)()
            .name(request.name)
            .phoneNum(request.phoneNum)
            .address(request.address)
            .city(request.city)
            .is_active(true)
            .created_at(new Date())
            .build();
    }
    editVendor(request) {
        return (0, builder_pattern_1.Builder)()
            .id(request.id)
            .name(request.name)
            .phoneNum(request.phoneNum)
            .address(request.address)
            .city(request.city)
            .is_active(request.is_active || false)
            .updated_at(new Date())
            .build();
    }
}
exports.default = VendorHelper;
