import BaseErrorRequest from "./BaseRequest/BaseErrorRequest";

export default class BadRequest extends BaseErrorRequest{
    constructor(err: string, code: number, message: string, errors: Array<object>){ 
        super(err, code, message, errors);
    }
}
