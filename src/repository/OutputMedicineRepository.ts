import { OutputMedicine, ReasonOfDispose } from "@prisma/client";
import BaseRepository from "./helper/BaseRepository";
import OutputMedicineVO from "../model/VOs/OutputMedicineVO"

export default class OutputMedicineRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async getAllOutputMedicines(limit: number, startIndex: number): Promise<OutputMedicineVO[]> {
        try {
            return await this.Prisma.outputMedicine.findMany({
                where: { is_active: true },
                select: {
                    id: true,
                    quantity: true,
                    reasonOfDispose: true,
                    is_active: true,
                    created_at: true,
                    updated_at: false,
                    medicine: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    report: {
                        select: {
                            id: true,
                            isFinalized: true,
                        }
                    }
                },
                orderBy: { created_at: 'desc' },
                skip: startIndex,
                take: limit
            });
        } catch (error) {
            console.error("Error getting all output medicines:", error);
            throw new Error("Failed to get all output medicines");
        }
    }

    public async getTotalOutputMedicines(): Promise<number> {
        try {
            return await this.Prisma.outputMedicine.count({
                where: { is_active: true },
                orderBy: { created_at: 'desc' }
            });
        } catch (error) {
            console.error("Error getting total output medicines:", error);
            throw new Error("Failed to get total output medicines");
        }
    }


    public async getOutputMedicineById(id: number): Promise<OutputMedicineVO | null> {
        try {
            return await this.Prisma.outputMedicine.findUnique({
                where: { id: id, is_active: true },
                select: {
                    id: true,
                    quantity: true,
                    reasonOfDispose: true,
                    is_active: true,
                    created_at: true,
                    updated_at: false,
                    medicine: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    report: {
                        select: {
                            id: true,
                            isFinalized: true,
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error getting output medicine by id:", error);
            throw new Error("Failed to get output medicine by id");
        }
    }

    public async getTotalOutputMedicineBySearch(q?: string, filter?: string): Promise<number> {
        try {
            return await this.Prisma.outputMedicine.count({
                where: {
                    AND: [
                        {
                            AND: [
                                { medicine: { name: { contains: q, mode: 'insensitive' } } },
                                { reasonOfDispose: filter as ReasonOfDispose }
                            ],
                        },
                        { is_active: true }
                    ]
                },
                orderBy: { created_at: 'desc' }
            });
        } catch (error) {
            console.error("Error getting total output medicines by search:", error);
            throw new Error("Failed to get total output medicines by search");
        }
    }

    public async getOutputMedicineBySearch(limit: number, startIndex: number, q?: string, filter?: string): Promise<OutputMedicineVO[]> {
        try {
            return await this.Prisma.outputMedicine.findMany({
                where: {
                    AND: [
                        {
                            AND: [
                                { medicine: { name: { contains: q, mode: 'insensitive' } } },
                                { reasonOfDispose: filter as ReasonOfDispose }
                            ]
                        },
                        { is_active: true }
                    ],
                },
                select: {
                    id: true,
                    quantity: true,
                    reasonOfDispose: true,
                    is_active: true,
                    created_at: true,
                    updated_at: false,
                    medicine: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    report: {
                        select: {
                            id: true,
                            isFinalized: true,
                        }
                    }
                },
                orderBy: { created_at: 'desc' },
                skip: startIndex,
                take: limit
            });
        } catch (error) {
            console.error("Error getting output medicines by search:", error);
            throw new Error("Failed to get output medicines by search");
        }
    }

    public async addOutputMedicine(outputMedicine: OutputMedicine): Promise<boolean> {
        try {
            const created: OutputMedicine = await this.Prisma.outputMedicine.create({ data: outputMedicine });
            return !!created;
        } catch (error) {
            console.error("Error adding output medicine:", error);
            throw new Error("Failed to add output medicine");
        }
    }

    public async editOutputMedicine(outputMedicine: OutputMedicine): Promise<boolean> {
        try {
            const updated: OutputMedicine = await this.Prisma.outputMedicine.update({
                where: { id: outputMedicine.id },
                data: outputMedicine
            });
            return updated ? true : false;
        } catch (error) {
            console.error("Error editing output medicine:", error);
            throw new Error("Failed to edit output medicine");
        }
    }

    public async deleteOutputMedicine(id: number): Promise<boolean> {
        try {
            const deleted: OutputMedicine = await this.Prisma.outputMedicine.update({
                where: { id: id },
                data: { is_active: false }
            });
            return deleted ? true : false;
        } catch (error) {
            console.error("Error deleting output medicine:", error);
            throw new Error("Failed to delete output medicine");
        }
    }

    public validReasonOfDispose(reason: string): string | undefined {
        const validReasons: Array<string> = Object.values(ReasonOfDispose);
        const upperParams: string = reason.toUpperCase();
        return validReasons.find(reason => reason === upperParams);
    }
}
