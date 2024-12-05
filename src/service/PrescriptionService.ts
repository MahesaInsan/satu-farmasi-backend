import PrescriptionRepository from "../repository/PrescriptionRepository";
import {Prescription, PrescriptionHasMedicine, Prisma, Status} from "@prisma/client";
import AddPrescriptionRequest from "../model/request/AddPrescriptionRequest";
import {Builder} from "builder-pattern";
import IdVO from "../model/VOs/IdVO";
import AddPrescribedMedicineRequest from "../model/request/AddPrescribedMedicineRequest";
import PrescriptionHasMedicineRepository from "../repository/PrescriptionHasMedicineRepository";
import MedicineService from "./MedicineService";
import PrescriptionSummaryVO from "../model/VOs/PrescriptionSummaryVO";
import PrescriptionSummaryResponse from "../model/response/PrescriptionSummaryResponse";
import PatientService from "./PatientService";
import EditPrescriptionRequest from "../model/request/EditPrescriptionRequest";
import ValidationHelper from "./helper/ValidationHelper";
import MedicineData from "../model/VOs/MedicineDropdownVO";
import PrescribedMedicineVO from "../model/VOs/PrescribedMedicine";
import DraftPrescriptionVO from "../model/VOs/DraftPrescriptionVO";
import PrescriptionDetailVO from "../model/VOs/PrescriptionDetailVO";
import DraftMedicineListVO from "../model/VOs/DraftMedicineListVO";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import PaginationRequest from "../model/request/PaginationRequest";

export default class PrescriptionService{
    private readonly prescriptionRepository: PrescriptionRepository
    private readonly prescriptionHasMedicineRepository: PrescriptionHasMedicineRepository
    private readonly medicineService: MedicineService
    private readonly patientService: PatientService
    private readonly validationHelper: ValidationHelper;

    constructor() {
        this.prescriptionRepository = new PrescriptionRepository();
        this.prescriptionHasMedicineRepository = new PrescriptionHasMedicineRepository();
        this.medicineService = new MedicineService();
        this.patientService = new PatientService();
        this.validationHelper = new ValidationHelper();
    }

    public async addNewPrescription (request: AddPrescriptionRequest): Promise<number> {
        try {
             await this.validationHelper.validatePrescriptionRequest(request)
            if (request.patient.patientId === -1) {
                return await this.patientService.addNewPatient(request.patient)
                    .then(async (idVO) => {
                        request.patient.patientId = idVO.id
                        return await this.createNewPrescription(request)
                    })
            } else {
                return await this.createNewPrescription(request)
            }
        } catch (error) {
            throw error as string
        }
    }

    public async getPrescription (prescriptionId: number) {
        try {
            const result = await this.prescriptionRepository.getPrescriptionByPrescriptionId(prescriptionId)

            if (result == null) {
                new Error("Not Found")
            }

            if (result && (Status.UNPROCESSED == result.status || Status.CANCELED == result.status)) {
                let draftPrescription: DraftPrescriptionVO;
                let draftMedicineList: DraftMedicineListVO[] = [];

                draftPrescription = await this.constructDraftPrescription(result);

                if (result && result.medicineList) {
                    console.log("this is draft")
                    console.log("rees:", result)
                    draftMedicineList = await Promise.all(
                        result.medicineList.map(async (prescribedMedicine) => {
                            const medicineData = await this.medicineService.getMedicineByCode(prescribedMedicine.medicineCode)
                            if (medicineData) {
                                return this.constructDraftMedicineList(prescribedMedicine, medicineData)
                            }
                            throw new Error("Medicine not found")
                        })
                    );

                    draftPrescription.medicineList = draftMedicineList
                    return draftPrescription
                }
                new Error("Medicine list is undefined")
            }
            console.log(result)
            result!.medicineList = await this.collectPrescribedMedicineByMedicineCode(result!.medicineList)
            return result
        } catch (error) {
            throw error as string
        }
    }

    private async collectPrescribedMedicineByMedicineCode(prescribedMedicineList: PrescribedMedicineVO[]) {
        try {
            const prescribedMedicineByMedicineCode = prescribedMedicineList.reduce<Map<string, PrescribedMedicineVO>>((medicineByMedicineCode, prescribedMedicine) => {
                if (medicineByMedicineCode.has(prescribedMedicine.medicine.code)) {
                    medicineByMedicineCode.get(prescribedMedicine.medicine.code)!.quantity += prescribedMedicine.quantity
                    medicineByMedicineCode.get(prescribedMedicine.medicine.code)!.totalPrice =
                        Prisma.Decimal.add(medicineByMedicineCode.get(prescribedMedicine.medicine.code)!.totalPrice,
                            prescribedMedicine.totalPrice)
                } else {
                    medicineByMedicineCode.set(prescribedMedicine.medicine.code, prescribedMedicine)
                }
                return medicineByMedicineCode
            }, new Map())

            return Array.from(prescribedMedicineByMedicineCode.values())
        } catch (error) {
            throw error as string
        }
    }

    public async getMostSalesMedicineByPrescription(startDate: Date, lastDate: Date) {
        try {
            // const prescriptions: Prescription[] = await this.prescriptionRepository.getAllPrescriptionPerMonth(startDate, lastDate);
            // console.log("prescriptions: ", prescriptions);
            // const result = await this.prescriptionHasMedicineRepository.getMostSalesMedicineByPrescription(
            //     prescriptions?.map(prescription => prescription.id)
            // );
            const result = await this.prescriptionHasMedicineRepository.getMostSalesMedicineByPrescription(startDate, lastDate)
            const data = await Promise.all(
                result.map(async item => {
                    const medicine = await this.medicineService.getMedicineById(item.medicineId!);
                    return {
                        medicineName: medicine?.name || null,
                        quantity: item._sum.quantity
                    }
                })
            )
            console.log(data);
            return data
        } catch (error) {
            console.error(error);
            throw error as string;
        }
    }

    public async createNewPrescription (request: AddPrescriptionRequest): Promise<number> {
        try {
            const newPrescription: Prescription = Builder<Prescription>()
                .patientId(request.patient.patientId)
                .status(Status.UNPROCESSED)
                .is_active(true)
                .created_at(new Date())
                .updated_at(new Date())
                .build();
            return await this.prescriptionRepository.createNewPrescription(newPrescription)
                .then(async (result: IdVO): Promise<number> => {
                    // await this.createNewPrescriptionHasMedicine(request.medicineList, result.id)
                    await this.createDraftPrescriptionHasMedicine(request, result.id)
                    return result.id
                })
        } catch (error) {
            throw error as string
        }
    }

    public async editPrescription(request: EditPrescriptionRequest) {
        try {
            let tuple: [Map<string, PrescriptionHasMedicine>, Map<number, PrescriptionHasMedicine>]

            await this.validationHelper.validatePrescriptionRequest(request)
            tuple = await this.mapOldPrescriptionHasMedicine(await this.findPrescriptionMedicine(request.prescriptionId))

            return await this.compareAndUpdatePrescriptionHasMedicine(tuple[0], request.medicineList,
                request.prescriptionId, tuple[1]).then(result => true)
        } catch (error) {
            throw error as string
        }
    }

    public async updatePrescriptionStatus(id: number, status: Status) {
        try {
            await this.prescriptionRepository.updatePrescriptionStatusById(status, id);
        } catch (error) {
            throw error as string
        }
    }

    public async countPrescription(patientName: string | undefined, status: Status | undefined) {
        try {
            return await this.prescriptionRepository.countPrescriptionByPatientName(patientName, status)
        } catch (error) {
            throw error as string
        }
    }

    private async findPrescriptionMedicine(prescriptionId: number) {
        try {
            return await this.prescriptionHasMedicineRepository.getPrescriptionHasMedicine(prescriptionId)
        } catch (error) {
            throw error as string
        }
    }

    private async compareAndUpdatePrescriptionHasMedicine(prescriptionHasMedicineByMedicineCode: Map<string, PrescriptionHasMedicine>,
                                                          newPrescribedMedicine: AddPrescribedMedicineRequest[], prescriptionId: number,
                                                          prescriptionHasMedicineById: Map<number, PrescriptionHasMedicine>) {
        try {
            let newPrescriptionHasMedicineUpdate: PrescriptionHasMedicine[] = [];
            let medicineCodes: Set<string> = new Set(prescriptionHasMedicineByMedicineCode.keys())
            newPrescribedMedicine.forEach(newPrescription => medicineCodes.add(newPrescription.code))

            const medicineByMedicineCode = await this.medicineService
                .getAndMapMedicineListByMedicineCode(Array.from(medicineCodes.values()))

            if (!medicineByMedicineCode) {
                new Error ("Medicines not found")
            }

            newPrescribedMedicine.forEach(newPrescription => {
                if (prescriptionHasMedicineByMedicineCode.has(newPrescription.code)) {
                    console.log("EXIST")
                    const updatedPrescriptionHasMedicine: PrescriptionHasMedicine =
                        prescriptionHasMedicineByMedicineCode.get(newPrescription.code)!
                    this.medicineService.updateMedicineReservedStock(updatedPrescriptionHasMedicine.quantity,
                        newPrescription.quantity, medicineByMedicineCode.get(newPrescription.code)!)
                    this.prescriptionHasMedicineRepository.updateWhereId(this.constructPrescriptionHasMedicineDraft(newPrescription, prescriptionId),
                        updatedPrescriptionHasMedicine.id)
                    prescriptionHasMedicineById.delete(updatedPrescriptionHasMedicine.id)
                } else {
                    console.log("NOT EXIST")
                    this.medicineService.updateMedicineReservedStock(0, newPrescription.quantity,
                        medicineByMedicineCode.get(newPrescription.code)!)
                    newPrescriptionHasMedicineUpdate.push(this.constructPrescriptionHasMedicineDraft(newPrescription, prescriptionId))
                }
            })

            prescriptionHasMedicineById.forEach(deletedPrescriptionHasMedicine => {
                console.log("DELETE")
                console.log(deletedPrescriptionHasMedicine)
                this.medicineService.updateMedicineReservedStock(deletedPrescriptionHasMedicine.quantity, 0,
                    medicineByMedicineCode.get(deletedPrescriptionHasMedicine.medicineCode)!)
            })
            await this.prescriptionHasMedicineRepository.deleteWherePrescriptionIdAndInId(prescriptionId, Array.from(prescriptionHasMedicineById.keys()));

            if (newPrescriptionHasMedicineUpdate.length > 0) {
                await this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(newPrescriptionHasMedicineUpdate);
            }
        } catch (error) {
            throw error as string
        }
    }

    private async mapOldPrescriptionHasMedicine(oldPrescriptionHasMedicine: PrescriptionHasMedicine[]):
            Promise<[Map<string, PrescriptionHasMedicine>, Map<number, PrescriptionHasMedicine>]>{
        let prescriptionHasMedicineByMedicineCode = new Map<string, PrescriptionHasMedicine>;
        let prescriptionHasMedicineById = new Map<number, PrescriptionHasMedicine>;

        oldPrescriptionHasMedicine.forEach(prescriptionHasMedicine => {
            prescriptionHasMedicineById.set(prescriptionHasMedicine.id, prescriptionHasMedicine)
            prescriptionHasMedicineByMedicineCode.set(prescriptionHasMedicine.medicineCode, prescriptionHasMedicine)
        })
        return [prescriptionHasMedicineByMedicineCode, prescriptionHasMedicineById];
    }

    public async changeDraftPrescriptionToFinalizedPrescription(prescriptionId: number) {
        const tuple: [Prescription | null, PrescriptionHasMedicine[]] = await Promise.all([
            this.prescriptionRepository.getPrescriptionById(prescriptionId),
            this.prescriptionHasMedicineRepository.getPrescriptionHasMedicine(prescriptionId),
        ])
        let medicineData;

        if (tuple[1].length > 0) {
            medicineData = await this.medicineService.getAndMapMedicineListByMedicineCode(
                tuple[1].map(prescriptionHasMedicine => prescriptionHasMedicine.medicineCode));
        } else throw new Error("Prescription doesn't have any medicine")

        if (tuple[0]) {
            const prescription = tuple[0]
            const prescriptionHasMedicine = tuple[1]

            let finalPrescriptionHasMedicine= await Promise.all(
                prescriptionHasMedicine.map(async prescriptionHasMedicine => {
                    if (medicineData.get(prescriptionHasMedicine.medicineCode)) {
                        return this.constructFinalizedPrescriptionHasMedicineAndUpdateStock(prescription.id,
                            medicineData.get(prescriptionHasMedicine.medicineCode)!, prescriptionHasMedicine.quantity,
                            prescriptionHasMedicine)
                    } else new Error ("Medicine with that code is not found");
                })
            )

            if (finalPrescriptionHasMedicine.length > 0) {
                await Promise.all([
                    this.prescriptionRepository.updatePrescriptionStatusById(Status.WAITING_FOR_PAYMENT, tuple[0].id),
                    this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(finalPrescriptionHasMedicine
                        .flat().filter(finalPHM => finalPHM !== undefined)),
                    this.prescriptionHasMedicineRepository.deleteWherePrescriptionIdAndInId(tuple[0].id, tuple[1]
                        .map(prescriptionHasMedicine => prescriptionHasMedicine.id))
                ])
            }
        } else new Error ("PrescriptionNotFound")
    }

    public async cancelPrescription(prescriptionId: number) {
        try {
            const [prescription, prescriptionHasMedicine] = await Promise.all([
                this.prescriptionRepository.getPrescriptionById(prescriptionId),
                this.prescriptionHasMedicineRepository.getPrescriptionHasMedicine(prescriptionId)
            ])

            if (!prescription) {
                new Error ("Prescription not found")
            }
            if (prescription!.status !== Status.UNPROCESSED) {
                new Error ("Prescription status is ineligible")
            }

            await this.medicineService.returnReservedStock(prescriptionHasMedicine)
            return await this.prescriptionRepository.updatePrescriptionStatusAndIsActiveById(prescriptionId)
        } catch (error) {
            throw error as string
        }
    }

    // private async createNewPrescriptionHasMedicine(medicineList: AddPrescribedMedicineRequest[], prescriptionId: number){
    //     try {
    //         const newPrescribeMedicineList = await this.updateMedicineStockAndCreatePrescriptionHasMedicine(medicineList, prescriptionId)
    //         console.log("prescribedMedicineList: ", newPrescribeMedicineList)
    //         return await this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(newPrescribeMedicineList)
    //     } catch (error) {
    //         throw error as string
    //     }
    // }

    private async createDraftPrescriptionHasMedicine(request: AddPrescriptionRequest, prescriptionId: number) {
        try {
            await this.reservedMedicineAndConstructDraftPrescriptionHasMedicine(request.medicineList, prescriptionId)
        } catch (error) {
            throw error as string
        }
    }
    private async reservedMedicineAndConstructDraftPrescriptionHasMedicine(medicineList: AddPrescribedMedicineRequest[], prescriptionId: number) {
        try {
            const medicineListByCode: Map<string, MedicineData[]> = await this.medicineService
                .getAndMapMedicineListByMedicineCode(medicineList.map(medicine => medicine.code))
            const prescriptionHasMedicine: PrescriptionHasMedicine[] = medicineList.map(medicine =>
                this.constructPrescriptionHasMedicineDraft(medicine, prescriptionId)
            ).flat()

            await Promise.all([
                medicineList.map(async (prescribedMedicine) => {
                    let quantityLeftToBeAssign = prescribedMedicine.quantity
                    const medicineToBeAssign = medicineListByCode.get(prescribedMedicine.code)

                    if (medicineToBeAssign) {
                        for (const medicine of medicineToBeAssign) {
                            if (quantityLeftToBeAssign === 0) break;

                            const assignedQuantity = Math.min(medicine.currStock - medicine.reservedStock, quantityLeftToBeAssign)
                            if (assignedQuantity > 0) {
                                this.medicineService.increaseReservedMedicine(medicine.id, assignedQuantity)
                                quantityLeftToBeAssign -= assignedQuantity
                            }
                        }
                    }
                }),
                this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(prescriptionHasMedicine)
            ])
            // const newPrescribeMedicineList = await Promise.all(
            //     medicineList .map(async (prescribedMedicineRequest: AddPrescribedMedicineRequest, index) => {
            //         await this.medicineService.decreaseMedicineStock(prescribedMedicineRequest.medicineId, prescribedMedicineRequest.quantity, `prescription.medicineList.${index}.quantity`)
            //         return  this.constructPrescriptionHasMedicine(prescribedMedicineRequest, prescriptionId)
            //     })
            // )
            // console.log("prescribedMedicineList: ", newPrescribeMedicineList)
            // return await this.prescriptionHasMedicineRepository.createPrescriptionHasMedicine(newPrescribeMedicineList)
        } catch (error) {
            throw error as string
        }
    }

    private async updateMedicineStockAndCreatePrescriptionHasMedicine(medicineList: AddPrescribedMedicineRequest[], prescriptionId: number) {
        const medicineListByCode: Map<string, MedicineData[]> = await this.medicineService
            .getAndMapMedicineListByMedicineCode(medicineList.map(medicine => medicine.code))

        const prescriptionHasMedicineList: PrescriptionHasMedicine[][] = await Promise.all(
            medicineList.map(async (prescribedMedicine) => {
                let quantityLeftToBeAssign = prescribedMedicine.quantity
                const medicineToBeAssign = medicineListByCode.get(prescribedMedicine.code)
                const prescriptionHasMedicinePerCode: PrescriptionHasMedicine[] = []

                if (medicineToBeAssign) {
                    for (const medicine of medicineToBeAssign) {
                        if (quantityLeftToBeAssign === 0) break;

                        const assignedQuantity = Math.min(medicine.currStock, quantityLeftToBeAssign)
                        prescriptionHasMedicinePerCode.push(this.constructPrescriptionHasMedicineV2(medicine.id,
                            medicine.code, assignedQuantity, prescribedMedicine.instruction, medicine.price, prescriptionId))
                        await this.medicineService.decreaseMedicineStock(medicine.id, assignedQuantity)
                        quantityLeftToBeAssign -= assignedQuantity
                    }
                }

                return prescriptionHasMedicinePerCode
            })
        )

        return prescriptionHasMedicineList.flat();
    }

    private constructPrescriptionHasMedicineDraft (prescribeMedicineRequest: AddPrescribedMedicineRequest, prescriptionId: number): PrescriptionHasMedicine {
        return Builder<PrescriptionHasMedicine>()
            .prescriptionId(prescriptionId)
            .medicineCode(prescribeMedicineRequest.code)
            .quantity(prescribeMedicineRequest.quantity)
            .instruction(prescribeMedicineRequest.instruction)
            .totalPrice(new Prisma.Decimal(Number(prescribeMedicineRequest.price) * prescribeMedicineRequest.quantity))
            .draft(true)
            .build();
    }

    private constructPrescriptionHasMedicineV2 (medicineId: number, medicineCode: string, quantity: number,
                                               instruction: string, price: Prisma.Decimal, prescriptionId: number) {
        return Builder<PrescriptionHasMedicine>()
            .prescriptionId(prescriptionId)
            .medicineCode(medicineCode)
            .medicineId(medicineId)
            .quantity(quantity)
            .instruction(instruction)
            .totalPrice(new Prisma.Decimal(Number(price) * quantity))
            .build();
    }

    public async getPrescriptionSummary(patientName: string | undefined, status: Status | undefined, pagination: PaginationRequest){
        try {
            return await this.prescriptionRepository.getAllPrescriptionByUsername(patientName, status, pagination.startIndex, pagination.limit);
        } catch (error) {
            throw error as string
        }
    }

    private constructPrescriptionSummaryVO(prescription: PrescriptionSummaryVO): PrescriptionSummaryResponse{
        return Builder<PrescriptionSummaryResponse>()
            .prescriptionId(prescription.id)
            .timestamps(prescription.created_at)
            .patientName(prescription.patient.name)
            .status(prescription.status)
            .build()
    }

    private async constructDraftMedicineList(prescribedMedicine: PrescribedMedicineVO, medicineVO: MedicineDisplayVO) {
        return Builder<DraftMedicineListVO>()
            .medicineCode(medicineVO.code)
            .medicineName(medicineVO.name)
            .quantity(prescribedMedicine.quantity)
            .instruction(prescribedMedicine.instruction)
            .totalPrice(prescribedMedicine.totalPrice)
            .build()
    }

    private async constructDraftPrescription(prescriptionDetailVO: PrescriptionDetailVO){
        return Builder<DraftPrescriptionVO>()
            .id(prescriptionDetailVO.id)
            .status(prescriptionDetailVO.status)
            .patient(prescriptionDetailVO.patient)
            .medicineList([])
            .build()
    }

    private async constructFinalizedPrescriptionHasMedicineAndUpdateStock(prescriptionId: number, medicineByCodeList: MedicineData[],
                                                                          quantity: number, prescriptionHasMedicine: PrescriptionHasMedicine) {
        let quantityLeftToAssign = quantity;
        const finalizedPrescriptionHasMedicineList: PrescriptionHasMedicine[] = [];
        for (const medicine of medicineByCodeList) {
            if (quantityLeftToAssign <= 0) {
                return finalizedPrescriptionHasMedicineList
            }
            const quantityToAssign = Math.min(quantityLeftToAssign, medicine.reservedStock);
            const finalizedPrescriptionHasMedicine: PrescriptionHasMedicine = this.constructPrescriptionHasMedicineV2(
                medicine.id, medicine.code, quantityToAssign, prescriptionHasMedicine.instruction, medicine.price, prescriptionId)
            finalizedPrescriptionHasMedicine.draft = false
            finalizedPrescriptionHasMedicineList.push(finalizedPrescriptionHasMedicine)
            await this.medicineService.decreaseStockAccordingToReservedUse(medicine.id, quantityToAssign)
            quantityLeftToAssign -= quantityToAssign
        }
    }

}
