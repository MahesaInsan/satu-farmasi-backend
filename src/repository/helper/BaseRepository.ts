import {PrismaClient} from "@prisma/client"

export default class BaseRepository{
    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient();
    }

    get Prisma(): PrismaClient {
        return this.prisma;
    }
}
