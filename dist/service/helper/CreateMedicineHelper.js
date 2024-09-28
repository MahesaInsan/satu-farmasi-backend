"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_pattern_1 = require("builder-pattern");
class CreateMedicineHelper {
    createGenericName(request) {
        return (0, builder_pattern_1.Builder)()
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
            .build();
    }
}
exports.default = CreateMedicineHelper;
