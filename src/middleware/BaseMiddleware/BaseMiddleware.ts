import ResponseHelper from "../../controller/ResponseHelper/ResponseHelper";

export default class BaseMiddleware {
    private readonly _responseHelper: ResponseHelper;

    constructor() {
        this._responseHelper = new ResponseHelper();
    }

    get responseHelper(): ResponseHelper {
        return this._responseHelper;
    }
}