import {Diagnose, PrismaClient} from "@prisma/client"

export default class DiagnoseRepository {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async creatDiagnose(newDiagnose: Diagnose): Promise<Diagnose>{
        try {
            return this.prisma.diagnose.create({
                data: newDiagnose
            })
        } catch (error) {
            throw error as string
        }
    }
}