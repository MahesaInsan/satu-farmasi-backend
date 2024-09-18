
export default abstract class BaseEntity{
    public id: number;
    public is_active: boolean;
    public created_at: Date;
    public updated_at: Date;

    constructor(id: number, is_active: boolean, created_at: Date, updated_at: Date) {
        this.id = id;
        this.is_active = is_active;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
