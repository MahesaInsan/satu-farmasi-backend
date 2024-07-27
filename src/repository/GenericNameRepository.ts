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

    public async editGenericName(genericName: GenericName): Promise<GenericName> {
        try {
            genericName.id = Number(genericName.id);
            return await this.Prisma.genericName.update({ where: { id: genericName.id }, data: genericName });
        } catch (error) {
            console.error('Error updating generic name:', error);
            throw new Error('Failed to edit generic name');
        }
    }

    public async deleteGenericName(id: number): Promise<Boolean> {
        try {
            await this.Prisma.genericName.delete({ where: { id: id } });
            return true;
        } catch (error) {
            console.error('Error deleting generic name:', error);
            throw new Error('Failed to delete generic name');
        }
    }
}