import BaseErrorRequest from "./BaseRequest/BaseErrorRequest";

export default class Unauthorized extends BaseErrorRequest{
    constructor(err: string, code: number, message: string) {
        super(err, code, message)
    }
}