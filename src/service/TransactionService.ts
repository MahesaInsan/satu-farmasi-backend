import AddTransactionRequest from "../model/request/AddTransactionRequest";
import PatientService from "./PatientService";
import PrescriptionService from "./PrescriptionService";
import PharmacistService from "./PharmacistService";
import PrescriptionDetailVO from "../model/VOs/PrescriptionDetailVO";
import {Prisma, Transaction} from "@prisma/client";
import {Builder} from "builder-pattern";
import {Response} from "express";
import TransactionRepository from "../repository/TransactionRepository";
import SSEConnection from "../model/response/SSEConnection";
import PaginationRequest from "../model/request/PaginationRequest";

export default class TransactionService{
    private readonly patientService: PatientService;
    private readonly prescriptionService: PrescriptionService;
    private readonly pharmacistService: PharmacistService;
    private readonly transactionRepository: TransactionRepository;

    private transactionSSE: SSEConnection[] = [];

    constructor() {
        this.patientService = new PatientService();
        this.prescriptionService = new PrescriptionService();
        this.pharmacistService = new PharmacistService();
        this.transactionRepository = new TransactionRepository();
    }

    public async createNewTransaction(request: AddTransactionRequest) {
        try {
            const tuple: [AddTransactionRequest, PrescriptionDetailVO] = await this.checkData(request) as [AddTransactionRequest, PrescriptionDetailVO]
            const totalPrice: Prisma.Decimal = await this.calculateTotalPrice(tuple[1])
            const newTransaction = Builder<Transaction>()
                .patientId(request.patientId)
                .prescriptionId(request.prescriptionId)
                .pharmacistId(1)
                .totalPrice(totalPrice)
                .is_active(true)
                .created_at(new Date())
                .updated_at(new Date())
                .build();
            await this.prescriptionService.updatePrescriptionToWaitingForPayment(tuple[1].id);
            return await this.transactionRepository.addTransaction(newTransaction).then(transaction => true)
        } catch (error) {
            throw error as string
        }
    }

    public async countTransaction(patientName: string | undefined) {
        try {
            return await this.transactionRepository.countTransaction(patientName);
        } catch (error) {
            throw error as string;
        }
    }

    public async getTransactionSummary(pagination: PaginationRequest, patientName: string | undefined) {
        try {
            return await this.transactionRepository.getAllTransaction(patientName, pagination.startIndex, pagination.limit);
        } catch (error) {
            throw error as string
        }
    }

    public async getTransactionById(transactionId: number){
        try {
            return await this.transactionRepository.getTransactionById(transactionId)
        } catch (error) {
            throw error as string
        }
    }

    public async subscribeNotification(res: Response) {
        const connection: SSEConnection = {
            id: "packagingEvent-" + Date.now(),
            res: res
        };
        this.transactionSSE.push(connection)
    }

    public async publishNotification(request: boolean) {
        if (request) {
            this.transactionSSE.forEach(transactionSSE => {
                try {
                    transactionSSE.res.write(`data: ${JSON.stringify(request)}\n\n`);
                } catch (error) {
                    console.error("Error sending data to SSE client:", error);
                    this.transactionSSE = this.transactionSSE.filter(p => p !== transactionSSE);
                }
            })
        }
    }

    public async closeConnection(res: Response){
        this.transactionSSE = this.transactionSSE.filter(transactionSSE => transactionSSE.res !== res);
    }

    private async checkData(request: AddTransactionRequest) {
        try {
            const pharmacist = await this.pharmacistService.getPharmacistById(1)
            const patient = await this.patientService.findIfExistById(request.patientId);
            const prescription = await this.prescriptionService.getPrescription(request.prescriptionId)
            if (!pharmacist) {
                new Error("Pharmacist Not Found!")
            }
            if (!patient) {
                new Error("Patient Not Found!")
            }
            if (!prescription) {
                new Error("Prescription Not Found!")
            }
            return [request, prescription];
        } catch (error) {
            throw error as string;
        }
    }

    private async calculateTotalPrice(prescription: PrescriptionDetailVO): Promise<Prisma.Decimal>{
        try {
            return prescription.medicineList
                .reduce((total: Prisma.Decimal, medicine) => Prisma.Decimal.add(total, medicine.totalPrice), new Prisma.Decimal(0))
        } catch (error) {
            throw error as string;
        }
    }
}