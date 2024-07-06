
export default abstract class BaseEntity{
    public id: number;
    public isActive: boolean;
    public created_at: Date;
    public updated_at: Date;

    constructor(id: number, isActive: boolean, created_at: Date, updated_at: Date) {
        this.id = id;
        this.isActive = isActive;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}