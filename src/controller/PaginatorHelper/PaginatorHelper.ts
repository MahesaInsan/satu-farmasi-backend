export default class PaginatorHelper {
    public paginate(page: number, limit: number, totalData: number) {
        const startIndex: number = (page - 1) * limit;
        const endIndex: number = page * limit;

        const result: { next?: object, previous?: object, startIndex: number, limit: number } = { startIndex, limit };
        if (endIndex < totalData) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        return result;
    }
}