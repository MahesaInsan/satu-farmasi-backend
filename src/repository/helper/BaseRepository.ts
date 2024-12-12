import {PrismaClient} from "@prisma/client"

export default class BaseRepository{
    private static prisma: PrismaClient;

    protected constructor() {
        if (!BaseRepository.prisma) {
            BaseRepository.prisma = new PrismaClient();
        }
    }

    protected get Prisma(): PrismaClient {
        return BaseRepository.prisma;
    }
}
