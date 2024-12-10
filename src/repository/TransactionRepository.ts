import {Transaction, PrismaClient, $Enums, PaymentMethod, Status} from "@prisma/client";
import TransactionSummaryVO from "../model/VOs/TransactionSummaryVO";
import TransactionDetailVO from "../model/VOs/TransactionDetailVO";

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

    public async countTransaction(patientName: string | undefined, status: Status | undefined): Promise<number>{
        try {
            return this.prisma.transaction.count({
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
}