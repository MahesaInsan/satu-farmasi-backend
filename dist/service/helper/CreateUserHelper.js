"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_pattern_1 = require("builder-pattern");
class CreateUserHelper {
    createBaseUser(request) {
        return (0, builder_pattern_1.Builder)()
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
            .nik(request.nik)
            .is_active(true)
            .email(request.email)
            .password(request.password)
            .firstName(request.firstName)
            .lastName(request.lastName)
            .dob(request.dob)
            .phoneNum(request.phoneNum)
            .build();
    }
}
exports.default = CreateUserHelper;
