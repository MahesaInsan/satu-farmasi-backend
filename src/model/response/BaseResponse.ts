//CURRENTLY UNUSED SAVED FOR LATTER BUT MIGHT BE DELETED

export default class BaseResponse<T> {
    public code: number | undefined;
    public status: string | undefined;
    public message: string | undefined;
    public data: T | undefined;

    constructor(code?: number, status?: string, message?: string, data?: T) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public ok(data?: T, message?: string): BaseResponse<T>{
        return new BaseResponse<T>(200, "OK", message, data)
    }

    public badRequest(message: string): BaseResponse<T>{
        return new BaseResponse<T>(400, "Bad Request", message, undefined)
    }
}