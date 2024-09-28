"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseValidation = void 0;
const express_validator_1 = require("express-validator");
class BaseValidation {
    constructor() {
        this.validationMethods = {
            isString: (validator) => validator.isString().withMessage("Input must be a string"),
            isLength: (validator, options) => validator.isLength(options).withMessage(`Input must be ${options.min} characters long`),
            isEmail: (validator) => validator.isEmail().withMessage("Input must be a valid email"),
            equals: (validator, value) => validator.equals(value).withMessage(`Input must be equal to ${value}`),
        };
    }
    validateBodyData(schema) {
        return Object.entries(schema).map(([key, rules]) => {
            let validator = (0, express_validator_1.body)(String(key));
            Object.entries(rules).forEach(([ruleName, ruleValue]) => {
                if (ruleName in this.validationMethods) {
                    validator = this.validationMethods[ruleName](validator, ruleValue);
                }
            });
            return validator;
        });
    }
}
exports.BaseValidation = BaseValidation;
