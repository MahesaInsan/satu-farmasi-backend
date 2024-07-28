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

    public async editGenericName(genericName: GenericName): Promise<boolean> {
        try {
            genericName.id = Number(genericName.id);
            await this.Prisma.genericName.update({ where: { id: genericName.id }, data: genericName });
            return true;
        } catch (error) {
            console.error('Error updating generic name:', error);
            throw new Error('Failed to edit generic name');
        }
    }

    public async getGenericNameById(id: number): Promise<GenericName | null> {
        try {
            return await this.Prisma.genericName.findUnique({ where: { id: id } });
        } catch (error) {
            console.error('Error getting generic name by id:', error);
            throw new Error('Failed to get generic name by id');
        }
    }

    public async deleteGenericName(id: number): Promise<boolean> {
        try {
            await this.Prisma.genericName.delete({ where: { id: id } });
            return true;
        } catch (error) {
            console.error('Error deleting generic name:', error);
            throw new Error('Failed to delete generic name');
        }
    }
}