"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_pattern_1 = require("builder-pattern");
class EditUserHelper {
    editBaseUser(request) {
        return (0, builder_pattern_1.Builder)()
            .is_active(request.is_active)
            .created_at(request.createdAt)
            .updated_at(new Date())
            .id(request.id)
            .nik(request.nik)
            .email(request.email)
            .password(request.password)
            .firstName(request.firstName)
            .lastName(request.lastName)
            .dob(request.dob)
            .phoneNum(request.phoneNum)
            .build();
    }
}
exports.default = EditUserHelper;
