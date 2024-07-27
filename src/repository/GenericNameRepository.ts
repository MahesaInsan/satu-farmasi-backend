import GenericName from "../entity/GenericName";
import BaseRepository from "./helper/BaseRepository";

export default class GenericNameRepository extends BaseRepository {
    constructor() {
        super();
    }
    public async addGenericName(genericName: GenericName): Promise<GenericName>{
        try {
            return await this.Prisma.genericName.create({ data: genericName })
        } catch (error) {
            console.error('Error adding generci name:', error);
            throw new Error('Failed to add generic name');
        }
    }
}