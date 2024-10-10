import BaseErrorRequest from "./BaseRequest/BaseErrorRequest";

export default class InternalServerRequest extends BaseErrorRequest{
    constructor(err: string, code: number, message: string, errors: Array<Object>) {
        super(err, code, message, errors)
    }
}
