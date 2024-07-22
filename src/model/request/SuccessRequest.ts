import BaseSuccessRequest from "./BaseRequest/BaseSuccessRequest";

export default class SuccessRequest extends BaseSuccessRequest<any> {

    constructor(code: number, status: string, data: any) {
        super(code, status, data);
    }
}