import {Transaction, PrismaClient, $Enums, PaymentMethod, Status} from "@prisma/client";
import TransactionSummaryVO from "../model/VOs/TransactionSummaryVO";
import TransactionDetailVO from "../model/VOs/TransactionDetailVO";
import TransactionByDateVO from "../model/VOs/TransactionByDateVO";
import TransactionAnnualRecapVO from "../model/VOs/TransactionAnnualRecapVO";

export default class TransactionRepository{
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async addTransaction(transaction: Transaction){
        try {
            return this.prisma.transaction.create({data: transaction})
        } catch (error) {
            throw error as string
        }
    }

    public async findById(id: number){
        try {
            return this.prisma.transaction.findFirst(
                {
                    include: {
                        prescription: true
                    },
                    where: {
                        id: id,
                        is_active: true
                    }
                }
            )
        } catch (error) {
            throw error as string
        }
    }

    public async updatePaymentMethodById(paymentMethod: PaymentMethod, id: number) {
        try {
            return this.prisma.transaction.update({
                where: {
                    id: id
                },
                data: {
                    paymentMethod: paymentMethod
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async updatePhysicalReportById(physicalReportId: number, id: number) {
        try {
            return this.prisma.transaction.update({
                where: {
                    id: id
                },
                data: {
                    physicalReportId: physicalReportId
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async countTransaction(patientName: string | undefined): Promise<number>{
        try {
            return this.prisma.transaction.count({
                where: {
                    is_active: true,
                    patient: {
                        name: patientName
                    }
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getAllTransaction(patientName: string | undefined, startIndex: number, limit: number): Promise<TransactionSummaryVO[]>{
        try {
            return this.prisma.transaction.findMany({
                where: {
                    is_active: true,
                    patient: {
                        name: {
                            contains: patientName,
                            mode: 'insensitive'
                        }
                    }
                },
                select: {
                    id: true,
                    updated_at: true,
                    patient: {
                        select: {
                            name: true
                        },
                    },
                    pharmacist: {
                        select: {
                            firstName: true
                        }
                    },
                    prescription: {
                        select: {
                            id: true,
                            status: true
                        }
                    }
                },
                skip: startIndex,
                take: limit,
                orderBy: [
                    {
                        prescription: {
                            status: "asc"
                        }
                    },
                    {
                        updated_at: "asc"
                    }
                ]
            })
        } catch (error){
            throw error as string
        }
    }

    public async getTransactionById(transactionId: number): Promise<TransactionDetailVO | null> {
        try {
            return this.prisma.transaction.findFirstOrThrow({
                where: {
                    id: transactionId
                },
                select: {
                    id: true,
                    totalPrice: true,
                    pharmacist: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    prescription: {
                        select: {
                            id: true,
                            status: true,
                            patient: {
                                select: {
                                    credentialNumber: true,
                                    name: true
                                }
                            },
                            medicineList: {
                                select: {
                                    quantity: true,
                                    instruction: true,
                                    totalPrice: true,
                                    medicine: {
                                        select: {
                                            name: true,
                                            price: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    physicalReport: {
                        select: {
                            id: true,
                            data: true,
                            created_at: true
                        }
                    }
                }
            }) as Promise<TransactionDetailVO>
        } catch (error) {
            throw error as string
        }
    }

    public async getTransactionByStatus(patientName: string | undefined, status: $Enums.Status, take: number): Promise<TransactionSummaryVO[]>{
        try {
            return this.prisma.transaction.findMany({
                where: {
                    is_active: true,
                    patient: {
                        name: {
                            contains: patientName,
                            mode: 'insensitive'
                        }
                    },
                    prescription: {
                        status: status
                    }
                },
                select: {
                    id: true,
                    updated_at: true,
                    patient: {
                        select: {
                            name: true
                        },
                    },
                    pharmacist: {
                        select: {
                            firstName: true
                        }
                    },
                    prescription: {
                        select: {
                            id: true,
                            status: true
                        }
                    }
                },
                orderBy: [
                    {
                        prescription: {
                            status: "asc"
                        }
                    },
                    {
                        updated_at: "asc"
                    }
                ],
                take: take
            })
        } catch (error){
            throw error as string
        }
    }

    public async getTransactionByDate(startDate: Date, lastDate: Date): Promise<TransactionByDateVO[]> {
        try {
            return this.prisma.$queryRaw
                `SELECT 
                    a."id",
                    a."prescriptionId",
                    d."id" as "medicineId",
                    d."name" as "medicineName",
                    c."quantity",
                    d."price" as "sellingPrice",
                    a."totalPrice"
                FROM "public"."Transaction" a
                LEFT JOIN "public"."Prescription" b ON a."prescriptionId" = b."id" 
                LEFT JOIN "public"."PrescriptionHasMedicine" c ON b."id" = c."prescriptionId"
                LEFT JOIN "public"."Medicine" d ON c."medicineId" = d."id"
                WHERE a."created_at" >= ${startDate} AND a."created_at" <= ${lastDate};`
        } catch (error) {
            throw error as string
        }
    }

    public async getAnnualTransactionRecap(year: number): Promise<TransactionAnnualRecapVO[]> {
        try {
            return this.prisma.$queryRaw
                `SELECT 
                    EXTRACT(MONTH FROM a."created_at") AS "month",
                    SUM(b."quantity") as "sales",
                    SUM(b."totalPrice") as "revenue"
                FROM "public"."Transaction" a
                JOIN "public"."PrescriptionHasMedicine" b ON a."prescriptionId" = b."prescriptionId"
                WHERE EXTRACT(YEAR FROM a."created_at") = ${year} AND b."draft" = false
                GROUP BY EXTRACT(MONTH FROM a."created_at")
                ORDER BY "month";
                `
        } catch (error) {
            throw error as string;
        }
    }
}