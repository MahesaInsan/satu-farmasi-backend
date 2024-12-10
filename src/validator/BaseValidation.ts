import { ValidationMethod, ValidationSchema } from "./helper/ValidationTypeHelper";
import { body } from "express-validator";

export class BaseValidation {
    protected validationMethods: { [key: string]: ValidationMethod } = {
        isNumber: (validator: any) => validator.isNumeric().withMessage("Input must be a number"),
        isBoolean: (validator: any) => validator.isBoolean().withMessage("Input must be a boolean"),
        isString: (validator: any) => validator.isString().withMessage("This field is required"),
        isLength: (validator: any, options: any) => validator.isLength(options).withMessage(`Input must be ${options.min} characters long`),
        isEmail: (validator: any) => validator.isEmail().withMessage("Input must be a valid email"),
        isISO8601: (validator: any) => validator.isISO8601().withMessage("Input must be a valid ISO8601 date"),
        equals: (validator: any, value: any) => validator.equals(value).withMessage(`Input must be equal to ${value}`),
    };
            
    protected validateBodyData(schema: ValidationSchema) {
        return Object.entries(schema).map(([key, rules]) => {
            let validator = body(String(key));

            Object.entries(rules).forEach(([ruleName, ruleValue]) => {
                if (ruleName in this.validationMethods) {
                    validator = this.validationMethods[
                        ruleName as keyof typeof this.validationMethods
                    ](validator, ruleValue);
                }
            });
            return validator;
        });
    }
}
