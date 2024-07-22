import BaseErrorRequest from "./BaseRequest/BaseErrorRequest";

export default class BadRequest extends BaseErrorRequest{
    constructor(err: string, code: number, message: string) {
        super(err, code, message)
    }
}