"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_pattern_1 = require("builder-pattern");
class ClassificationHelper {
    createClassification(request) {
        return (0, builder_pattern_1.Builder)()
            .label(request.label)
            .value(request.value)
            .is_active(true)
            .created_at(new Date())
            .build();
    }
    editClassification(request) {
        return (0, builder_pattern_1.Builder)()
            .id(request.id)
            .label(request.label)
            .value(request.value)
            .is_active(request.is_active)
            .created_at(new Date())
            .build();
    }
}
exports.default = ClassificationHelper;
