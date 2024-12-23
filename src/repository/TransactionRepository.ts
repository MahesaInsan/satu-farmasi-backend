import {Transaction, PrismaClient, $Enums, PaymentMethod, Status, Prisma} from "@prisma/client";
import TransactionSummaryVO from "../model/VOs/TransactionSummaryVO";
import TransactionDetailVO from "../model/VOs/TransactionDetailVO";
import TotalIncomeTransactionVO from "../model/VOs/TotalIncomeTransactionVO";
import TransactionAnnualRecapVO from "../model/VOs/TransactionAnnualRecapVO";
import BaseRepository from "./helper/BaseRepository";

export default class TransactionRepository extends BaseRepository{

    constructor() {
        super();
    }

    public async addTransaction(transaction: Transaction){
        try {
            return this.Prisma.transaction.create({data: transaction})
        } catch (error) {
            throw error as string
        }
    }

    public async findById(id: number){
        try {
            return this.Prisma.transaction.findFirst(
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
            return this.Prisma.transaction.update({
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
            return this.Prisma.transaction.update({
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

    public async countTransaction(patientName: string | undefined, status: Status | undefined): Promise<number>{
        try {
            return this.Prisma.transaction.count({
                where: {
                    is_active: true,
                    patient: {
                        name: patientName
                    },
                    prescription: {
                        status: status
                    }
                }
            })
        } catch (error) {
            throw error as string
        }
    }

    public async getAllTransaction(patientName: string | undefined, status: Status | undefined,
                                   startIndex: number, limit: number): Promise<TransactionSummaryVO[]>{
        try {
            return this.Prisma.transaction.findMany({
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
            return this.Prisma.transaction.findFirstOrThrow({
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
            return this.Prisma.transaction.findMany({
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

    public async getTotalIncomeByDate(startDate: Date, lastDate: Date): Promise<TotalIncomeTransactionVO[]> {
        try {
            return await this.Prisma.$queryRaw
                `SELECT 
                    SUM(a."totalPrice") as "totalPrice"
                FROM "public"."Transaction" a
                WHERE a."created_at" >= ${startDate} AND a."created_at" <= ${lastDate}
                FETCH FIRST 1 ROWS ONLY;`
        } catch (error) {
            throw error as string
        }
    }

    

    public async getAnnualTransactionRecap(year: number): Promise<TransactionAnnualRecapVO[]> {
        try {
            return this.Prisma.$queryRaw<TransactionAnnualRecapVO[]> (
                Prisma.sql`
                WITH ExistingData AS (
                    SELECT 
                        EXTRACT(MONTH FROM a."created_at") AS "month",
                        CAST(SUM(b."quantity") AS INTEGER) AS "sales",
                        CAST(SUM(b."totalPrice") AS DECIMAL) AS "revenue"
                    FROM "public"."Transaction" a
                    JOIN "public"."PrescriptionHasMedicine" b ON a."prescriptionId" = b."prescriptionId"
                    WHERE EXTRACT(YEAR FROM a."created_at") = ${year} AND b."draft" = false
                    GROUP BY EXTRACT(MONTH FROM a."created_at")
                    ORDER BY "month" ASC
                )
                SELECT 
                    months.month AS "month",
                    CAST(COALESCE(SUM("sales"), 0) AS INTEGER) AS "sales",
                    COALESCE(SUM("revenue"), 0) AS "revenue"
                FROM generate_series(1, 12) AS months(month)
                LEFT JOIN ExistingData ON months.month = ExistingData.month
                GROUP BY months.month
                ORDER BY "month" ASC;
                `
            )
                
        } catch (error) {
            throw error as string;
        }
    }
}
