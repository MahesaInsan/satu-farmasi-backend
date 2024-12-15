import MedicineRepository from "../repository/MedicineRepository";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import TotalMedicineGroupByCodeVO from "../model/VOs/TotalMedicineGroupByCodeVO";
import {
	GenericName,
	Medicine,
	MedicineHasClassification,
	Prisma,
	PrescriptionHasMedicine,
	UnitOfMeasure,
	ReasonOfDispose
} from "@prisma/client";
import AddMedicineRequest from "../model/request/AddMedicineRequest";
import { Builder } from "builder-pattern";
import GenericNameService from "./GenericNameService";
import EditMedicineRequest from "../model/request/EditMedicineRequest";
import MedicineCheckStockVO from "../model/VOs/MedicineCheckStockVO";
import AddMedicineClassificationRequest from "../model/request/AddMedicineClassificationRequest";
import MedicineHasClassificationRepository from "../repository/MedicineHasClassificationRepository";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import AddPrescribedMedicineRequest from "../model/request/AddPrescribedMedicineRequest";
import MedicineData from "../model/VOs/MedicineDropdownVO";
import AddClassificationRequest from "../model/request/AddClassificationRequest";
import { CustomError } from "../validator/helper/ErrorHelper";
import PrescriptionHasMedicineRepository from "../repository/PrescriptionHasMedicineRepository";
import ExpiredMedicineResponse from "../model/response/ExpiredMedicineResponse";

export default class MedicineService {
	private readonly medicineRepository: MedicineRepository;
	private readonly genericNameService: GenericNameService;
	private readonly medicineHasClassificationRepository: MedicineHasClassificationRepository;
	private readonly prescriptionHasMedicineRepository: PrescriptionHasMedicineRepository;

	constructor() {
		this.medicineRepository = new MedicineRepository();
		this.genericNameService = new GenericNameService();
		this.medicineHasClassificationRepository = new MedicineHasClassificationRepository();
		this.prescriptionHasMedicineRepository = new PrescriptionHasMedicineRepository();
	}

	public async getAllMedicineList(isActive?: boolean): Promise<Map<string, MedicineDropdownVO>> {
		try {
			const medicineList: MedicineDropdownVO[] = await this.medicineRepository.fetchMedicineList(isActive)
            console.log("dropdown: ", medicineList)
			let medicineByMedicineCode: Map<string, MedicineDropdownVO> = new Map<string, MedicineDropdownVO>();
			if (medicineList !== null) {
				medicineByMedicineCode = await this.mapMedicineDropdownList(medicineList)
			} else {
				new Error("No Medicine Found")
			}
            console.log("medicineByMedicineCode: ", medicineByMedicineCode)
			return medicineByMedicineCode;
		} catch (error) {
			throw error as string
		}
	}

	public async getAllMedicineListById(){
		try {
			const medicineList = await this.medicineRepository.fetchMedicineListById();
			return medicineList.reduce((medicineByMedicineId, medicine) => {
				medicineByMedicineId.set(medicine.id, medicine)
				return medicineByMedicineId
			}, new Map<number, MedicineDropdownVO>)
		} catch (error) {
			throw error as string
		}
	}

	public async getSingleMedicineById(id: number): Promise<Medicine | null> {
		try {
			return await this.medicineRepository.getMedicineById(id);
		} catch (error) {
			throw error as string;
		}
	}

	public async getAndMapMedicineListByMedicineCode(medicineCodes: string[]) {
		try {
			return await this.medicineRepository.getMedicineByCodeInAndIsActiveTrue(medicineCodes)
				.then(medicines => medicines.reduce<Map<string, MedicineData[]>>((map, medicine) => {
					if (map.has(medicine.code)) {
						map.get(medicine.code)?.push(medicine)
					} else {
						map.set(medicine.code, [medicine])
					}
					return map
				}, new Map()))
		} catch (error) {
			throw error as string
		}
	}

	public async getTotalActiveMedicineByCode(): Promise<number> {
		try {
			const medicineList: MedicineDropdownVO[] = await this.medicineRepository.fetchMedicineList()
			return medicineList.length;
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalMedicines(): Promise<number> {
		try {
			return await this.medicineRepository.getTotalMedicines();
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalSearchMedicines(parameter: string | undefined): Promise<number> {
		try {
			return await this.medicineRepository.getTotalSearchMedicines(parameter);
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalSearchMedicineByCode(parameter: string | undefined): Promise<number> {
		try {
			return await this.medicineRepository.getTotalSearchMedicinesByCode(parameter);
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalMedicineCodeByCode(code: string): Promise<number> {
		try {
			const result = await this.medicineRepository.getAllMedicineCodeByCode(code)
			if (result && result.length > 0) {
				result.sort((codeA, codeB) => {
					const aNumber = parseInt(codeA.code.split('-')[1])
					const bNumber = parseInt(codeB.code.split('-')[1])
					return bNumber - aNumber
				})
				return parseInt(result[0].code.split('-')[1])
			} else return 0
		} catch (error) {
			throw error as string;
		}
	}

	public async getTotalNeedToRestock(): Promise<number> {
		try {
			return await this.medicineRepository.getTotalNeedToRestock();
		} catch (error) {
			throw error as string;
		}
	}

	public async getAllMedicines(startIndex: number, limit: number): Promise<MedicineDisplayVO[]> {
		try {
			return await this.medicineRepository.getMedicines(startIndex, limit);
		} catch (error) {
			throw error as string;
		}
	}

	public async getMedicineById(id: number): Promise<Medicine | null> {
		try {
			return await this.medicineRepository.getMedicineById(id);
		} catch (error) {
			throw error as string;
		}
	}

	public async getMedicineSummaryByCode(startIndex: number, limit: number, searchQuery: string | undefined,
										  sortBy: string | undefined, sortMode: string | undefined): Promise<MedicineDisplayVO[]> {
		try {
			const validatedQuery = await this.checkIfParamValid(searchQuery, sortBy, sortMode)
			const medicineSummaryByCode = await this.medicineRepository.getMedicineSummaryByCode(startIndex, limit, validatedQuery[0],
				validatedQuery[1], validatedQuery[2]);
			return this.constructMedicineByCodeSummary(medicineSummaryByCode)
		} catch (error) {
			throw error as string;
		}
	}

	public async getMedicineSummaryById(startIndex: number, limit: number, searchQuery: string | undefined,
										sortBy: string | undefined, sortMode: string | undefined): Promise<MedicineDisplayVO[]> {
		try {
			const validatedQuery = await this.checkIfParamValid(searchQuery, sortBy, sortMode)
			return await this.medicineRepository.getMedicineSummaryById(startIndex, limit, validatedQuery[0],
				validatedQuery[1], validatedQuery[2]);
		} catch (error) {
			throw error as string;
		}
	}

	public async getMedicineByCode(code: string): Promise<MedicineDisplayVO | null> {
		try {
			return await this.medicineRepository.getMedicineByCode(code);
		} catch (error) {
			throw error as string;
		}
	}

	public async searchMedicines(startIndex: number, limit: number, parameter: string): Promise<MedicineDisplayVO[]> {
		try {
			return await this.medicineRepository.searchMedicines(startIndex, limit, parameter);
		} catch (error) {
			throw error as string;
		}
	}

	public async increaseReservedMedicine(medicineId: number, quantity: number) {
		try {
			console.log("increase:", medicineId, quantity)
			await this.medicineRepository.increaseReserveStock(medicineId, quantity)
		} catch (error) {
			throw error as string
		}
	}

	public async decreaseReservedMedicine(medicineId: number, quantity: number) {
		try {
			console.log("decrease:", medicineId, quantity)
			await this.medicineRepository.decreaseReserveStock(medicineId, quantity)
		} catch (error) {
			throw error as string
		}
	}

	public async decreaseStockAndReservedStock(medicineId: number, quantityStock: number, quantityReservedStock: number) {
		try {
			console.log("Decrease stock according to reservedStock:", medicineId, quantityStock, quantityReservedStock)
			const updatedStock = await this.medicineRepository.decreaseStockAndDecreaseReservedStock(medicineId, quantityStock, quantityReservedStock)
			updatedStock.currStock == 0 && this.medicineRepository.setMedicineIsActiveToFalse(medicineId).catch((error) => {
				console.error(`Failed to set medicine as inactive for ID ${medicineId}:`, error);
			});
		} catch (error) {
			throw error as string
		}
	}

	public async activeMedicineById(medicineId: number) {
		try {
			await this.medicineRepository.activateMedicineById(medicineId);
		} catch (error) {
			throw error as string;
		}
	}

	public async createMedicine(request: AddMedicineRequest): Promise<MedicineDisplayVO> {
		try {
            let oldMedicine: MedicineDisplayVO | null = null;
            if (request.code) {
			    oldMedicine = await this.getMedicineByCode(request.code);
            }

			request.code = !oldMedicine
				? await this.generateMedicineCode(request.genericNameId)
				: request.code;

            console.log("currStock: ", request.currStock)
            console.log("maxStock", request.maxStock)
			if (request.currStock > request.maxStock) {
				throw new Error("Error: jumlah stok melebihi jumlah maksimum stok!")
			}

			const medicine: Medicine = this.constructMedicine(request);
			return this.medicineRepository.createMedicine(medicine)
				.then(async (newMedicine: MedicineDisplayVO): Promise<MedicineDisplayVO> => {
					await this.createNewMedicineHasClassification(request.classificationList, newMedicine.id);
					return newMedicine;
				});
		} catch (error) {
			throw error as string;
		}
	}

	public async createNewMedicineHasClassification(classificationList: AddMedicineClassificationRequest[], medicineId: number) {
		try {
			const newMedicineHasClassification: MedicineHasClassification[] = classificationList
				.map((classification: AddMedicineClassificationRequest) => {
					return this.constructMedicineHasClassification(classification.classificationId, medicineId);
				})
			console.log("newMedicineClassification: ", newMedicineHasClassification);
			return await this.medicineHasClassificationRepository.createMedicineHasClassification(newMedicineHasClassification);
		} catch (error) {
			throw error as string;
		}
	}

	public async editMedicine(request: EditMedicineRequest): Promise<boolean> {
		try {
			const oldMedicine: Medicine | null = await this.getMedicineById(request.id);
			if (!oldMedicine) throw new Error("Medicine not found");

			request.code = oldMedicine && (oldMedicine.genericNameId === request.genericNameId)
				? request.code
				: await this.generateMedicineCode(request.genericNameId);

			this.isDuplicateClassification(request.classificationList);

			const medicine: Medicine = this.sanitizeUpdateData(this.constructEditMedicine(request),
				['id', 'batchCode', 'is_active', 'created_at']);
			const updatedMedicines = await this.medicineRepository.findAllMedicineIdByMedicineCode(oldMedicine.code)
			await this.medicineRepository.updateActiveMedicine(oldMedicine.code, medicine)

			await Promise.all(
				updatedMedicines?.map(async (medicine) => {
					try {
						await this.medicineHasClassificationRepository.deleteMedicineHasClassification(medicine.id);
						await this.createNewMedicineHasClassification(request.classificationList, medicine.id);
					} catch (error) {
						console.error(`Error processing update medicine with ID ${medicine.id}:`, error);
					}
				}) ?? []
			);

			this.medicineRepository.updateInactiveMedicine(oldMedicine.code, medicine)
				.then(() => { return true })
				.catch(() => { console.warn("No inactive medicines were updated") })
			return true
		} catch (error) {
			throw error as string;
		}
	}

	public async editMedicineForReceiveById(request: Medicine) {
		try {
			const oldMedicine: Medicine | null = await this.getMedicineById(request.id);
			if (!oldMedicine) throw new Error("Medicine not found");

			request.code = oldMedicine && oldMedicine.genericNameId === request.genericNameId
				? request.code
				: await this.generateMedicineCode(request.genericNameId);

			await this.medicineRepository.editMedicineById(request);
		} catch (error) {
			throw error as string;
		}
	}

    public isDuplicateClassification(classificationList: AddMedicineClassificationRequest[]): void {
        try {
            const classificationSet = new Set<number>();
            classificationList.forEach((classification: AddMedicineClassificationRequest) => {
                classificationSet.add(classification.classificationId)
            })
            if (classificationSet.size != classificationList.length)
                throw new CustomError().formatError("Duplicate medicine classification are not allowed", "custom");
        } catch (error) {
            throw error as string;
        }
    }

	// public async addStock(id: number, currStock: number): Promise<boolean> {
	// 	try {
	// 		const medicine: Medicine | null = await this.getMedicineById(id);
	// 		if (!medicine) throw new Error("Medicine not found");
	// 		medicine.currStock += currStock;
	// 		if (medicine.currStock > medicine.maxStock) throw new Error("Max stock reached");
	// 		return await this.medicineRepository.editMedicine(medicine) != null;
	// 	} catch (error) {
	// 		throw error as string;
	// 	}
	// }

	public async checkStock(id: number): Promise<MedicineCheckStockVO> {
		try {
			const medicine: Medicine | null = await this.getMedicineById(id);
			if (!medicine) throw new Error("Medicine not found");

			const vo: MedicineCheckStockVO = {isReady: true, flag: -1};
			if (medicine.currStock == medicine.minStock) vo.flag = 0;
			else if (medicine.currStock > medicine.minStock && medicine.currStock <= medicine.maxStock) vo.flag = 1;

			return vo;
		} catch (error) {
			throw error as string;
		}
	}

	// public async deleteMedicine(id: number): Promise<MedicineDisplayVO> {
	// 	try {
	// 		const medicine: Medicine | null = await this.getMedicineById(id);
	// 		if (!medicine) throw new Error("Medicine not found");
	// 		medicine.is_active = false;
	// 		return await this.medicineRepository.editMedicine(medicine);
	// 	} catch (error) {
	// 		throw error as string;
	// 	}
	// }

	public async checkExpiration(date: Date): Promise<Medicine[]> {
		try {
			const today: Date = new Date(date);
			const lastDay: Date = new Date(today.getFullYear(), today.getMonth() + 1, 0)
			return await this.medicineRepository.checkExpiration(today, lastDay);
		} catch (error) {
			throw error as string;
		}
	}

	public async hardDeleteMedicineById(medicineId: number) {
		try {
			return await this.medicineHasClassificationRepository.deleteMedicineHasClassification(medicineId)
			.then(async () => {
					await this.medicineRepository.hardDeleteMedicineById(medicineId);
				})
		} catch (error) {
			throw error as string;
		}
	}

	public async returnReservedStock (prescriptionHasMedicine: PrescriptionHasMedicine[]){
		try {
			const medicineList = await this.getAndMapMedicineListByMedicineCode(
				prescriptionHasMedicine.map(medicine => medicine.medicineCode))

			await Promise.all(
				prescriptionHasMedicine.map(async phm => {
					if (medicineList.has(phm.medicineCode)) {
						let quantityLeftToRemoved = phm.quantity
						const medicineToBeUpdated = medicineList.get(phm.medicineCode)
							?.filter(medicine => medicine.reservedStock > 0).reverse()

						for (const medicine of medicineToBeUpdated!) {
							if (quantityLeftToRemoved === 0) break

							const quantityRemoved = Math.min(medicine.reservedStock, quantityLeftToRemoved)
							await this.decreaseReservedMedicine(medicine.id, quantityRemoved)
							quantityLeftToRemoved -= quantityRemoved
						}
					} else new Error ("Medicine doesn't exist")
				})
			)
		} catch (error) {
			throw error as string
		}
	}

	public async generateMedicineCode(genericNameId: number): Promise<string> {
		try {
			const genericName: GenericName | null = await this.genericNameService.getGenericNameById(genericNameId);
			if (!genericName) throw new Error("Generic name not found");

			console.log(genericName.value);
			const totalMedicine: number = await this.getTotalMedicineCodeByCode(genericName.value.toUpperCase());
			const formatNumber: string = (totalMedicine + 1).toString().padStart(6, "0");
			console.log("medicine code: ", formatNumber);

			return `${genericName.value.toUpperCase()}-${formatNumber}`
		} catch (error) {
			throw error as string;
		}
	}

	private constructMedicine(request: AddMedicineRequest): Medicine {
		return Builder<Medicine>()
			.is_active(false)
			.created_at(new Date())
			.updated_at(new Date())
			.code(request.code)
			.name(request.name)
			.batchCode(request.batchCode)
			.genericNameId(request.genericNameId)
			.merk(request.merk)
			.description(request.description)
			.unitOfMeasure(request.unitOfMeasure)
			.price(request.price)
			.expiredDate(request.expiredDate)
			.packagingId(request.packagingId)
			.currStock(request.currStock)
			.minStock(request.minStock)
			.maxStock(request.maxStock)
			.sideEffect(request.sideEffect)
			.build();
	}

	private constructEditMedicine(request: EditMedicineRequest): Medicine {
		return Builder<Medicine>()
			.id(request.id)
			.code(request.code)
			.name(request.name)
			.merk(request.merk)
			.batchCode(request.batchCode)
			.description(request.description)
			.unitOfMeasure(request.unitOfMeasure)
			.price(request.price)
			.packagingId(request.packagingId)
			.genericNameId(request.genericNameId)
			.minStock(request.minStock)
			.maxStock(request.maxStock)
			.sideEffect(request.sideEffect)
			.is_active(request.isActive)
			.created_at(request.createdAt)
			.updated_at(new Date())
			.build();
	}

	private constructMedicineHasClassification(classificationId: number, medicineId: number): MedicineHasClassification {
		return Builder<MedicineHasClassification>()
			.medicineId(medicineId)
			.classificationId(classificationId)
			.build();
	}

	public async decreaseMedicineStock(medicineId: number, quantity: number, path: string = "quantity") {
		try {
			await this.medicineRepository.decreaseStock(medicineId, quantity, path)
		} catch (error) {
			throw error as string;
		}
	}

	public async increaseMedicineStock(medicineId: number, quantity: number) {
		try {
			await this.medicineRepository.increaseStock(medicineId, quantity)
		} catch (error) {
			throw error as string;
		}
	}

	public async getMedicineValidationList(medicineCodeList: string[]) {
		try {
			return this.medicineRepository.getMedicineByCodeIn(medicineCodeList);
		} catch (error) {
			throw error as string;
		}
	}

	private async mapMedicineDropdownList(medicineList: MedicineDropdownVO[]) {
		return medicineList.reduce((medicineByMedicineCode, medicine) => {
			medicineByMedicineCode.set(medicine.code, medicine)
			return medicineByMedicineCode
		}, new Map<string, MedicineDropdownVO>)
	}

	public async updateMedicineStock(oldPrescriptionQuantity: number, newPrescriptionQuantity: number, medicineId: number) {
		try {
			if (newPrescriptionQuantity > oldPrescriptionQuantity) {
				console.log("decrease stock")
				await this.decreaseMedicineStock(medicineId, newPrescriptionQuantity - oldPrescriptionQuantity)
			} else if (oldPrescriptionQuantity > newPrescriptionQuantity) {
				console.log("increase stock")
				await this.increaseMedicineStock(medicineId, oldPrescriptionQuantity - newPrescriptionQuantity)
			}
		} catch (error) {
			throw error as object;
		}
	}

	public async checkIfExpiredMedicineStillExist(expiredDate: Date): Promise<Medicine[]> {
		try {
			const startOfDay = new Date(expiredDate)
			startOfDay.setHours(0, 0, 0, 0)
			const endOfDay = new Date(expiredDate)
			endOfDay.setHours(23, 59, 59, 999)

			return await this.medicineRepository.checkIfMedicineExpiredTodayStillActive(startOfDay, endOfDay)
		} catch (error) {
			throw error as string
		}
	}

	public async getExpiredMedicineBeforeToday(expiredDate: Date): Promise<ExpiredMedicineResponse[]> {
		try {
			const medicineList: Medicine[] = await this.checkIfExpiredMedicineStillExist(expiredDate)
			if (medicineList.length === 0) {
				return []
			}
			return medicineList.map(medicine => this.constructExpiredMedicineResponse(medicine))
		} catch (error) {
			throw error as string
		}
	}

	private async checkIfParamValid(searchQuery: string | undefined, sortBy: string | undefined, sortMode: string | undefined) {
		searchQuery === undefined ? searchQuery = "" : searchQuery;
		if (sortBy && !Object.values(Prisma.MedicineScalarFieldEnum).toString().includes(sortBy)) {
			sortBy = undefined
			sortMode = undefined
		}
		if (sortMode && !(sortMode === "asc" || sortMode === "desc")) {
			sortBy = undefined
			sortMode = undefined
		}

		return [searchQuery, sortBy, sortMode]
	}

	private async constructMedicineByCodeSummary(medicineList: MedicineDisplayVO[]) {
		const date = new Date()
		const lastYear = new Date(date.getFullYear() - 5, date.getMonth(), date.getDate());
		const thisYear = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		let medicineSoldQuantityByMedicineCode = new Map<String, number>
		const lowStockMedicineCodeList = medicineList.reduce((lowStockMedicineCodeList: string[], medicine) => {
			if (medicine.currStock <= medicine.minStock) {
				lowStockMedicineCodeList.push(medicine.code)
			}
			return lowStockMedicineCodeList
		}, [])

		const medicineSoldCount = await this.prescriptionHasMedicineRepository
			.getSoldCountMedicineByCode(lowStockMedicineCodeList, lastYear, thisYear);

		await Promise.all(
			medicineSoldCount.map(async medicine => {
				medicineSoldQuantityByMedicineCode.set(medicine.medicineCode, medicine._sum.quantity!);
			})
		);

		console.log(medicineSoldQuantityByMedicineCode)

		await Promise.all(
			medicineList.map(async medicine => {
				if (medicineSoldQuantityByMedicineCode.has(medicine.code)) {
					const recommendedStock = this.countMedicineConsumption(
						medicineSoldQuantityByMedicineCode.get(medicine.code)!,
						medicine.currStock
					);

					medicine.lowStock = true;
					medicine.recommendedRestock = Math.min(recommendedStock, medicine.maxStock)
				} else {
					medicine.lowStock = false;
					medicine.recommendedRestock = 0;
				}
			})
		);
		return medicineList;
	}

	private countMedicineConsumption(soldCount: number, currentStock: number) {
		const averageSold = Math.round(soldCount / 12);
		const bufferStock = Math.round(averageSold * 0.2)
		const leadTimeStock = Math.round(averageSold / 4)

		console.log(averageSold, "+", bufferStock, "+", leadTimeStock, "-", currentStock)
		return (averageSold + bufferStock + leadTimeStock) - currentStock
	}

	public async updateMedicineReservedStock(oldPrescriptionQuantity: number, newPrescriptionQuantity: number, medicineList: MedicineData[]) {
		try {
			let quantityLeftToUpdate = Math.abs(oldPrescriptionQuantity - newPrescriptionQuantity)
			if (newPrescriptionQuantity < oldPrescriptionQuantity) {
				console.log(`decrease reserve stock for ${medicineList.map(medicine => medicine.code)}, 
					with old quantity: ${oldPrescriptionQuantity} and new quantity: ${newPrescriptionQuantity}`)
				medicineList = medicineList.filter(medicineData => medicineData.reservedStock > 0).reverse()
				medicineList.every(medicine => {
					console.log("quantityLeft:", quantityLeftToUpdate)
					const quantityUpdated = Math.min(quantityLeftToUpdate, medicine.reservedStock)
					this.decreaseReservedMedicine(medicine.id, quantityUpdated)
					quantityLeftToUpdate -= quantityUpdated
					return quantityLeftToUpdate > 0
				})
			} else if (newPrescriptionQuantity > oldPrescriptionQuantity) {
				console.log(`increase reserve stock for ${medicineList.map(medicine => medicine.code)}, 
					with old quantity: ${oldPrescriptionQuantity} and new quantity: ${newPrescriptionQuantity}`)
				console.log("quantityLeft:", quantityLeftToUpdate)
				medicineList.every(medicine => {
					const quantityUpdated = Math.min(quantityLeftToUpdate, medicine.currStock - medicine.reservedStock)
					if (medicine.currStock - medicine.reservedStock > 0) {
						this.increaseReservedMedicine(medicine.id, quantityUpdated)
						quantityLeftToUpdate -= quantityUpdated
					}
					return quantityLeftToUpdate > 0
				})
			}
		} catch (error) {
			throw error as object;
		}
	}

	private constructExpiredMedicineResponse(medicine: Medicine) {
		return Builder<ExpiredMedicineResponse>()
			.medicineId(medicine.id)
			.medicineName(medicine.name)
			.batchCode(medicine.batchCode)
			.currStock(medicine.currStock)
			.quantity(medicine.currStock)
			.expiredDate(medicine.expiredDate)
			.reasonOfDispose(ReasonOfDispose.EXPIRED)
			.build()
	}

	private sanitizeUpdateData(data: Medicine, excludedFields: (keyof Medicine)[]): Medicine {
		return Object.fromEntries(
			Object.entries(data)
				.filter(([key, value]) => value !== undefined && !excludedFields.includes(key as keyof Medicine))
		) as Medicine
	};
}
