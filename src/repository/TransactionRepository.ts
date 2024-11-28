import {Transaction, PrismaClient, $Enums, PaymentMethod, Status} from "@prisma/client";
import TransactionSummaryVO from "../model/VOs/TransactionSummaryVO";
import TransactionDetailVO from "../model/VOs/TransactionDetailVO";
import TransactionByDateVO from "../model/VOs/TransactionByDateVO";

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
                }
            }).then(result => result as TransactionDetailVO | null)
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
            return this.prisma.$queryRawUnsafe(
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
                WHERE a."created_at" >= $1 AND a."created_at" <= $2;`,
                startDate, lastDate
            )
        } catch (error) {
            throw error as string
        }
    }

    
}