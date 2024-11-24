import MedicineRepository from "../repository/MedicineRepository";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import TotalMedicineGroupByCodeVO from "../model/VOs/TotalMedicineGroupByCodeVO";
import { GenericName, Medicine, MedicineHasClassification, Prisma, UnitOfMeasure } from "@prisma/client";
import AddMedicineRequest from "../model/request/AddMedicineRequest";
import { Builder } from "builder-pattern";
import GenericNameService from "./GenericNameService";
import EditMedicineRequest from "../model/request/EditMedicineRequest";
import MedicineCheckStockVO from "../model/VOs/MedicineCheckStockVO";
import AddMedicineClassificationRequest from "../model/request/AddMedicineClassificationRequest";
import MedicineHasClassificationRepository from "../repository/MedicineHasClassificationRepository";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import { CustomError } from "../validator/helper/ErrorHelper";

export default class MedicineService {
	private readonly medicineRepository: MedicineRepository;
	private readonly genericNameService: GenericNameService;
	private readonly medicineHasClassificationRepository: MedicineHasClassificationRepository;

	constructor() {
		this.medicineRepository = new MedicineRepository();
		this.genericNameService = new GenericNameService();
		this.medicineHasClassificationRepository = new MedicineHasClassificationRepository();
	}

	public async getAllMedicineList(): Promise<Map<number, MedicineDropdownVO>> {
		return await this.mapMedicineDropdownList(await this.medicineRepository.fetchMedicineList());
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

	public async getTotalMedicineByCode(code: string): Promise<number> {
		try {
			const result: TotalMedicineGroupByCodeVO[] =  await this.medicineRepository.getTotalMedicineGroupByCode(code);
			return result.length < 1 ? 0 : result.length;
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
			return await this.medicineRepository.getMedicineSummaryByCode(startIndex, limit, validatedQuery[0],
				validatedQuery[1], validatedQuery[2]);
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

	public async createMedicine(request: AddMedicineRequest): Promise<MedicineDisplayVO> {
		try {
			const oldMedicine: MedicineDisplayVO | null = await this.getMedicineByCode(request.code);

			request.code = !oldMedicine
				? await this.generateMedicineCode(request.genericNameId)
				: request.code;

			const medicine: Medicine = this.constructMedicine(request);
			return await this.medicineRepository.createMedicine(medicine)
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

	public async editMedicine(request: EditMedicineRequest): Promise<MedicineDisplayVO> {
		try {
			const oldMedicine: Medicine | null = await this.getMedicineById(request.id);
			if (!oldMedicine) throw new Error("Medicine not found");

			request.code = oldMedicine && oldMedicine.genericNameId === request.genericNameId
				? request.code
				: await this.generateMedicineCode(request.genericNameId);

            this.isDuplicateClassification(request.classificationList);

			const medicine: Medicine = this.constructEditMedicine(request);
			return await this.medicineRepository.editMedicine(medicine)
				.then(async (newMedicine: MedicineDisplayVO): Promise<MedicineDisplayVO> => {
					await this.medicineHasClassificationRepository.deleteMedicineHasClassification(request.id);
					await this.createNewMedicineHasClassification(request.classificationList, request.id);
					return newMedicine;
				})
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

	public async addStock(id: number, currStock: number): Promise<boolean> {
		try {
			const medicine: Medicine | null = await this.getMedicineById(id);
			if (!medicine) throw new Error("Medicine not found");
			medicine.currStock += currStock;
			if (medicine.currStock > medicine.maxStock) throw new Error("Max stock reached");
			return await this.medicineRepository.editMedicine(medicine) != null;
		} catch (error) {
			throw error as string;
		}
	}

	public async checkStock(id: number): Promise<MedicineCheckStockVO> {
		try {
			const medicine: Medicine | null = await this.getMedicineById(id);
			if (!medicine) throw new Error("Medicine not found");

			const vo: MedicineCheckStockVO = { isReady: true, flag: -1 };
			if (medicine.currStock == medicine.minStock) vo.flag = 0;
			else if (medicine.currStock > medicine.minStock && medicine.currStock <= medicine.maxStock) vo.flag = 1;

			return vo;
		} catch (error) {
			throw error as string;
		}
	}

	public async deleteMedicine(id: number): Promise<MedicineDisplayVO> {
		try {
			const medicine: Medicine | null = await this.getMedicineById(id);
			if (!medicine) throw new Error("Medicine not found");
			medicine.is_active = false;
			return await this.medicineRepository.editMedicine(medicine);
		} catch (error) {
			throw error as string;
		}
	}

    public async checkExpiration(date: Date): Promise<Medicine[]> {
        try {
            const today: Date = new Date(date);
            const lastDay: Date = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            return await this.medicineRepository.checkExpiration(today, lastDay);
        } catch (error) {
            throw error as string;
        }
    }

	// ganti jadi count all (jangan spesifik per generic name)
	private async generateMedicineCode(genericNameId: number): Promise<string> {
		try {
			const genericName: GenericName | null = await this.genericNameService.getGenericNameById(genericNameId);
			if (!genericName) throw new Error("Generic name not found");

			console.log(genericName.value);
			const totalMedicine: number = await this.getTotalMedicineByCode(genericName.value);
			const formatNumber: string = (totalMedicine+1).toString().padStart(6, "0");
			console.log("medicine code: ", formatNumber);

			return `${genericName.value}-${formatNumber}`
		} catch (error) {
			throw error as string;
		}
	}

	private constructMedicine(request: AddMedicineRequest): Medicine {
		return Builder<Medicine>()
			.is_active(true)
			.created_at(new Date())
			.updated_at(new Date())
			.code(request.code)
			.name(request.name)
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
			.description(request.description)
			.unitOfMeasure(request.unitOfMeasure)
			.price(request.price)
			.expiredDate(request.expiredDate)
			.packagingId(request.packagingId)
			.genericNameId(request.genericNameId)
			.currStock(request.currStock)
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

	public async getMedicineValidationList(medicineIdList: number[]) {
		try {
			return this.medicineRepository.getMedicineIdIn(medicineIdList);
		} catch (error) {
			throw error as string;
		}
	}

	private async mapMedicineDropdownList(medicineList: MedicineDropdownVO[]) {
		return medicineList.reduce((medicineByMedicineId, medicine) => {
			medicineByMedicineId.set(medicine.id, medicine)
			return medicineByMedicineId
		}, new Map<number, MedicineDropdownVO>)
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
}
