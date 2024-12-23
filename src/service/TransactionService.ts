import AddTransactionRequest from "../model/request/AddTransactionRequest";
import PatientService from "./PatientService";
import PrescriptionService from "./PrescriptionService";
import PharmacistService from "./PharmacistService";
import PrescriptionDetailVO from "../model/VOs/PrescriptionDetailVO";
import {PaymentMethod, Prisma, Status, Transaction} from "@prisma/client";
import {Builder} from "builder-pattern";
import {Response} from "express";
import TransactionRepository from "../repository/TransactionRepository";
import SSEConnection from "../model/response/SSEConnection";
import PaginationRequest from "../model/request/PaginationRequest";
import TransactionSummaryVO from "../model/VOs/TransactionSummaryVO";
import ChangeTransactionStatusVO from "../model/VOs/ChangeTransactionStatusVO";
import ConfirmPayRequest from "../model/request/ConfirmPayRequest";
import TransactionByDateVO from "../model/VOs/TransactionByDateVO";
import ReceiveMedicineService from "./ReceiveMedicineService";
import ReceiveMedicineVO from "../model/VOs/ReceiveMedicineVO";
import TransactionAnnualRecapVO from "../model/VOs/TransactionAnnualRecapVO";
import MedicineReportService from "./MedicineReportService";
import TodayMedicineReportVOs from "../model/VOs/TodayMedicineReportVO";
import AddMedicineReportRequest from "../model/request/AddMedicineReportRequest";
import MedicineReportHelper from "./helper/MedicineReportHelper";
import PhysicalReportService from "./PhysicalReportService";
import PhysicalReportVO from "../model/VOs/PhysicalReportVO";
import TotalIncomeTransactionVO from "../model/VOs/TotalIncomeTransactionVO";
import TotalOutcomeReceiveVO from "../model/VOs/TotalOutcomeReceiveVO";
import OutputMedicineService from "./OutputMedicineService";
import ValidationHelper from "./helper/ValidationHelper";
import TotalOutcomeOutputVO from "../model/VOs/TotalOutcomeOutputVO";

export default class TransactionService{
    private readonly patientService: PatientService;
    private readonly prescriptionService: PrescriptionService;
    private readonly pharmacistService: PharmacistService;
    private readonly receiveMedicineService: ReceiveMedicineService;
    private readonly medicineReportService:MedicineReportService;
    private readonly medicineReportHelper: MedicineReportHelper;
    private readonly transactionRepository: TransactionRepository;
    private readonly physicalReportService: PhysicalReportService;
    private readonly outputMedicineService: OutputMedicineService;
    private readonly validationHelper: ValidationHelper;

    private transactionSSE: SSEConnection[] = [];

    constructor() {
        this.patientService = new PatientService();
        this.prescriptionService = new PrescriptionService();
        this.pharmacistService = new PharmacistService();
        this.receiveMedicineService = new ReceiveMedicineService();
        this.medicineReportService = new MedicineReportService();
        this.transactionRepository = new TransactionRepository();
        this.medicineReportHelper = new MedicineReportHelper();
        this.physicalReportService = new PhysicalReportService();
        this.outputMedicineService = new OutputMedicineService(); 
        this.validationHelper = new ValidationHelper();
    }

    public async createNewTransaction(request: AddTransactionRequest) {
        try {
            const tuple: [AddTransactionRequest, PrescriptionDetailVO] = await this.checkData(request) as [AddTransactionRequest, PrescriptionDetailVO]
            const totalPrice: Prisma.Decimal = await this.calculateTotalPrice(tuple[1])
            console.log("request", request)
            const newTransaction = Builder<Transaction>()
                .patientId(request.patientId)
                .prescriptionId(request.prescriptionId)
                .pharmacistId(request.pharmacistId)
                .totalPrice(totalPrice)
                .is_active(true)
                .created_at(request.created_at || new Date())
                .updated_at(new Date())
                .build();
            await this.prescriptionService.changeDraftPrescriptionToFinalizedPrescription(tuple[1].id)

            let todayReport: TodayMedicineReportVOs | null =
                await this.medicineReportService.getTodayUnFinalizedMedicineReport();

            if (!todayReport) {
                const reportRequest: AddMedicineReportRequest = new AddMedicineReportRequest(false, true, request.created_at || new Date());
                todayReport = await this.medicineReportService.
                    addMedicineReport(this.medicineReportHelper.createMedicineReport(reportRequest))
            }
            newTransaction.reportId = todayReport.id

            return await this.transactionRepository.addTransaction(newTransaction).then(transaction => true)
        } catch (error) {
            throw error as string
        }
    }

    public async countTransaction(patientName: string | undefined, status: Status | undefined) {
        try {
            return await this.transactionRepository.countTransaction(patientName, status);
        } catch (error) {
            throw error as string;
        }
    }

    public async getTransactionSummary(pagination: PaginationRequest, patientName: string | undefined, status: Status | undefined) {
        try {
            return await this.transactionRepository.getAllTransaction(patientName, status,
                pagination.startIndex, pagination.limit);
        } catch (error) {
            throw error as string
        }
    }

    public async getTransactionById(transactionId: number){
        try {
            const transactionDetail = await this.transactionRepository.getTransactionById(transactionId)
            let prescriptionDetail;

            if (transactionDetail) {
                prescriptionDetail = await this.prescriptionService.getPrescription(transactionDetail.prescription.id) as PrescriptionDetailVO
            } else {
                new Error ("Transaction detail not found!")
            }

            if (prescriptionDetail) {
                transactionDetail!.prescription.medicineList = prescriptionDetail.medicineList.map(prescribedMedicine => ({
                    quantity: prescribedMedicine.quantity,
                    instruction: prescribedMedicine.instruction,
                    totalPrice: prescribedMedicine.totalPrice,
                    medicine: {
                        name: prescribedMedicine.medicine.name,
                        price: prescribedMedicine.medicine.price
                    }
                }))
            } else {
                new Error("Prescription not found")
            }
            console.log(transactionDetail?.prescription.medicineList)
            return transactionDetail
        } catch (error) {
            throw error as string
        }
    }

    public async getTotalIncomeByDate(startDate: Date, lastDate: Date): Promise<TotalIncomeTransactionVO[]> {
        try {
            return await this.transactionRepository.getTotalIncomeByDate(new Date(startDate), new Date(lastDate))
        } catch (error) {
            throw error as string
        }
    }

    public async getAnnualTransactionRecap(year: number): Promise<TransactionAnnualRecapVO[]> {
        try {
            return await this.transactionRepository.getAnnualTransactionRecap(year);
        } catch (error) {
            throw error as string;
        }
    }

    public async getOnGoingAndWaitingPaymentTransaction(patientName: string | undefined) {
        try {
            const onGoing: TransactionSummaryVO[] = await this.transactionRepository.getTransactionByStatus(patientName, "ON_PROGRESS", 5)
            const waitingPayment: TransactionSummaryVO[] = await this.transactionRepository.getTransactionByStatus(patientName, "WAITING_FOR_PAYMENT", 5)
            return onGoing.concat(waitingPayment);
        } catch (error) {
            throw error as string
        }
    }

    // TODO: 
    // 1. tambah untuk output medicine juga
    // 2. ganti logic, transaction id simpen ke set & panggil repo nya pake select IN
    public async getTransactionProfitByDate(startDate: Date, lastDate: Date): Promise<Prisma.Decimal> {
        try {
            const income: TotalIncomeTransactionVO[] = await this.getTotalIncomeByDate(startDate, lastDate);
            const outcomeByReceive: TotalOutcomeReceiveVO[] = await this.receiveMedicineService.getTotalCostReceiveMedicineByDate(startDate, lastDate);
            const outcomeByOutput: TotalOutcomeOutputVO[] = await this.outputMedicineService.getTotalCostOutputMedicineByDate(startDate, lastDate);

            const totalIncome: Prisma.Decimal = new Prisma.Decimal(income?.[0]?.totalPrice ?? 0);
            const totalOutcomeReceive: Prisma.Decimal = new Prisma.Decimal(outcomeByReceive?.[0]?.buyingPrice ?? 0);
            const totalOutcomeOutput: Prisma.Decimal = new Prisma.Decimal(outcomeByOutput?.[0]?.totalPrice ?? 0);
            
            return totalIncome.sub(totalOutcomeReceive.add(totalOutcomeOutput));
        } catch (error) {
            throw error as string;
        }
    }

    public async subscribeNotification(res: Response) {
        const connection: SSEConnection = {
            id: "packagingEvent-" + Date.now(),
            res: res
        };
        this.transactionSSE.push(connection)
    }

    public async publishNotification(request: ChangeTransactionStatusVO) {
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

    public async confirmPayment(request: ConfirmPayRequest) {
        try {
            const transaction = await this.transactionRepository.findById(request.id)
            if (transaction !== null) {
                if (Object.values(PaymentMethod).includes(request.paymentMethod) &&
                        Status.WAITING_FOR_PAYMENT === transaction.prescription.status) {
                    const physicalReport: PhysicalReportVO = await this.physicalReportService.createPhysicalReport(request.physicalReport);
                    await this.transactionRepository.updatePhysicalReportById(physicalReport.id, request.id);
                    await this.transactionRepository.updatePaymentMethodById(request.paymentMethod, request.id)
                    await this.prescriptionService.updatePrescriptionStatus(transaction.prescriptionId, Status.ON_PROGRESS)
                    return true;
                } else {
                    new Error ('Payment method does not exist');
                }
            } else {
                new Error ('Transaction Not Found')
            }
        } catch (error) {
            throw error as string
        }
    }

    public async finishTransaction(req: ChangeTransactionStatusVO) {
        try {
            const prescription = await this.prescriptionService.getPrescription(req.prescriptionId)
            if (prescription !== null) {
                if (Object.values(Status).includes(req.status) && Status.ON_PROGRESS === prescription!.status) {
                    await this.prescriptionService.updatePrescriptionStatus(req.prescriptionId, Status.DONE)
                    return true
                }
            } else {
                new Error ('Prescription not found')
            }
        } catch (error) {
            throw error as string
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
            console.log("prescription.medicineList", prescription.medicineList)
            const test =  prescription.medicineList
                .reduce((total: Prisma.Decimal, medicine) => Prisma.Decimal.add(total, medicine.totalPrice), new Prisma.Decimal(0))
            console.log("test", test)
            return test;
        } catch (error) {
            throw error as string;
        }
    }
}
