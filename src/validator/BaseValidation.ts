import { ValidationMethod, ValidationSchema } from "./helper/ValidationTypeHelper";
import { body } from "express-validator";

export class BaseValidation {
    protected validationMethods: { [key: string]: ValidationMethod } = {
        isString: (validator: any) => validator.isString().withMessage("Input must be a string"),
        isLength: (validator: any, options: any) => validator.isLength(options).withMessage(`Input must be ${options.min} characters long`),
        isEmail: (validator: any) => validator.isEmail().withMessage("Input must be a valid email"),
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
