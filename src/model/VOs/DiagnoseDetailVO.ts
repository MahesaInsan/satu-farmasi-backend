export default interface DiagnoseDetailVO {
    id: number,
    title: string,
    description: string,
    created_at: Date,
    prescription: {
        id: number
    }
}