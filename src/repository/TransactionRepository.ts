import {Transaction, PrismaClient, $Enums} from "@prisma/client";
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

    public async getTransactionById(transactionId: number): Promise<TransactionDetailVO> {
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
            })
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