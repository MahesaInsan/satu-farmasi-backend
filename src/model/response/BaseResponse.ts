//CURRENTLY UNUSED SAVED FOR LATTER BUT MIGHT BE DELETED
import { Result } from "express-validator";
import { CustomError } from "../../validator/helper/ErrorHelper";

export default class BaseResponse<T> {
    public code: number | undefined;
    public status: string | undefined;
    public message: string | undefined;
    public data: T | undefined;
    public errors: T | undefined;

    constructor(code?: number, status?: string, message?: string, data?: T, errors?: T) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    public ok(data?: T, message?: string): BaseResponse<T> {
        return new BaseResponse<T>(200, "OK", message, data)
    }

    public badRequest(message: string, errors?: T | undefined): BaseResponse<T> {
        return new BaseResponse<T>(400, "Bad Request", message, undefined, errors)
    }

    public constructErrorHandler(error: any) {
        let defaultErrorMsg = !error.message ? "Something is wrong" : error.message;
        let errors: Array<Object | undefined> = [];

        if (error instanceof CustomError) {
			defaultErrorMsg = error.message;
			errors.push(error.details);
		}
        else if (error instanceof Result) {
            defaultErrorMsg = "Validation Failed";
            errors.push(error.mapped());
        }

        return { defaultErrorMsg, errors };
    }
}
