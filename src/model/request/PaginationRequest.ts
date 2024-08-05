export default interface PaginationRequest {
    next?: object;
    previous?: object;
    results?: object,
    startIndex: number;
    limit: number;
}