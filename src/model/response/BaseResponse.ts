//CURRENTLY UNUSED SAVED FOR LATTER BUT MIGHT BE DELETED

export default class BaseResponse<T> {
    public code: number | undefined;
    public status: string | undefined;
    public data: T | undefined;

    constructor(code?: number, status?: string, data?: T) {
        this.code = code;
        this.status = status;
        this.data = data;
    }

    public ok(data: T): BaseResponse<T>{
        return new BaseResponse<T>(200, "OK", data)
    }
}