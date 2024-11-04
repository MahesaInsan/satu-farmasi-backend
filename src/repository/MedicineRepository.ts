import { Medicine, PrismaClient } from "@prisma/client"
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import { CustomError } from "../validator/helper/ErrorHelper";

export default class MedicineRepository {
	private prisma: PrismaClient

	constructor() {
		this.prisma = new PrismaClient()
	}

	public async fetchMedicineList(): Promise<MedicineDropdownVO[]> {
		try {
			return this.prisma.medicine.findMany({
				where: {
					is_active: true,
					currStock: {
						gt: 0
					},
					expiredDate: {
						gt: new Date(Date.now() + 7)
					}
				},
				select: {
					id: true,
					code: true,
					name: true,
					merk: true,
					currStock: true,
					minStock: true,
					price: true,
					classifications: {
						select: {
							classification: {
								select: {
									label: true
								}
							}
						}
					},
					packaging: {
						select: {
							label: true
						}
					},
					genericName: {
						select: {
							label: true
						}
					}
				}
			});
		} catch (error) {
			console.error('Error getting medicineList:', error);
			throw new Error('Failed to get medicineList');
		}
	}

	public async decreaseStock(medicineId: number, quantity: number) {
		try {
			const medicine: Medicine | null = await this.getMedicineById(medicineId);
			if (!medicine) {
				throw new CustomError().formatError("Medicine Not Found", "medicineId");
			}
			const isValidStock = (medicine.currStock - quantity) >= medicine.minStock;
			if (!isValidStock) {
				throw new CustomError().formatError("Medicine stock is not enough", "quantity");
			}

			await this.prisma.medicine.update({
				where: {
					id: medicineId
				},
				data: {
					currStock: {
						decrement: quantity
					}
				}
			})
		} catch (error) {
			throw error as string
		}
	}

	public async increaseStock(medicineId: number, quantity: number) {
		try {
			const medicine: Medicine | null = await this.getMedicineById(medicineId);
			if (!medicine) throw new Error('Medicine not found');
			const isValid = (medicine.currStock + quantity) <= medicine.maxStock;
			if (!isValid) throw new Error('Medicine stock is over the limit');

			await this.prisma.medicine.update({
				where: {
					id: medicineId,
				},
				data: {
					currStock: {
						increment: quantity
					}
				}
			})
		} catch (error) {
			throw error as string
		}
	}

	public async getMedicineIdIn(medicineId: number[]) {
		try {
			return this.prisma.medicine.findMany({
				where: {
					id: {
						in: medicineId
					}
				}
			})
		} catch (error) {
			throw error as string
		}
	}

	public async getTotalMedicines(): Promise<number> {
		try {
			return this.prisma.medicine.count({ where: { is_active: true } })
		} catch (error) {
			console.error('Error counting medicineList: ', error);
			throw new Error('Failed to count medicineList');
		}
	}

	public async getTotalSearchMedicines(parameter: string): Promise<number> {
		try {
			return this.prisma.medicine.count({
				where: {
					AND: [
						{
							OR: [
								{ name: { contains: parameter } },
								{ code: { startsWith: parameter } },
								{ merk: { contains: parameter } }
							]
						},
						{
							is_active: true
						}
					]
				}
			})
		} catch (error) {
			console.error('Error coounting search medicineList: ', error);
			throw new Error('Failed to count medicineList');
		}
	}

	public async getTotalMedicineByCode(code: string): Promise<number> {
		try {
			return this.prisma.medicine.count({
				where: {
					code: { contains: code }
				}
			})
		} catch (error) {
			console.error('Error counting medicineList: ', error);
			throw new Error('Failed to count medicineList');
		}
	}


	public async getMedicines(startIndex: number, limit: number): Promise<MedicineDisplayVO[]> {
		try {
			return this.prisma.medicine.findMany({
				where: { is_active: true },
				skip: startIndex,
				take: limit,
				select: {
					id: true,
					code: true,
					name: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
					sideEffect: true,
					is_active: true,
					created_at: true,
					updated_at: true,
					genericName: {
						select: {
							id: true,
							label: true,
							value: true
						}
					},
					packaging: {
						select: {
							id: true,
							label: true,
							value: true
						}
					},
					classifications: {
						select: {
							classification: {
								select: {
									id: true,
									label: true,
									value: true
								}
							}
						}
					},
				},
			});
		} catch (error) {
			console.error('Error getting medicineList:', error);
			throw new Error('Failed to get medicineList');
		}
	}

	public async getMedicineById(id: number): Promise<Medicine | null> {
		try {
			return this.prisma.medicine.findFirst({ where: { id: id } });
		} catch (error) {
			console.error('Error getting medicine by id:', error);
			throw new Error('Failed to get medicine by id');
		}
	}

	public async getMedicineByCode(code: string): Promise<MedicineDisplayVO | null> {
		try {
			return this.prisma.medicine.findFirst({
				where: {
					code: code,
					is_active: true
				},
				select: {
					id: true,
					code: true,
					name: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
					sideEffect: true,
					is_active: true,
					created_at: true,
					updated_at: true,
					genericName: {
						select: {
							id: true,
							label: true,
							value: true
						}
					},
					packaging: {
						select: {
							id: true,
							label: true,
							value: true
						}
					},
					classifications: {
						select: {
							classification: {
								select: {
									id: true,
									label: true,
									value: true
								}
							}
						}
					},
				},
			});
		} catch (error) {
			console.error('Error getting medicine by code:', error);
			throw new Error('Failed to get medicine by code');
		}
	}

	public async searchMedicines(startIndex: number, limit: number, parameter: string): Promise<MedicineDisplayVO[]> {
		try {
			return this.prisma.medicine.findMany({
				where: {
					AND: [
						{
							OR: [
								{ name: { contains: parameter } },
								{ code: { startsWith: parameter } },
								{ merk: { contains: parameter } },
								{ description: { contains: parameter } },
								{ sideEffect: { contains: parameter } }
							]
						},
						{
							is_active: true
						}
					],
				},
				skip: startIndex,
				take: limit,
				select: {
					id: true,
					code: true,
					name: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
					sideEffect: true,
					is_active: true,
					created_at: true,
					updated_at: true,
					genericName: {
						select: {
							id: true,
							label: true,
							value: true
						}
					},
					packaging: {
						select: {
							id: true,
							label: true,
							value: true
						}
					},
					classifications: {
						select: {
							classification: {
								select: {
									id: true,
									label: true,
									value: true
								}
							}
						}
					},
				},
			});
		} catch (error) {
			console.error('Error getting medicineList:', error);
			throw new Error('Failed to get medicineList');
		}
	}

	public async createMedicine(dataMedicine: Medicine): Promise<MedicineDisplayVO> {
		try {
			const newMedicine = await this.prisma.medicine.create({
				data: dataMedicine,
				select: {
					id: true,
					code: true,
					name: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
					sideEffect: true,
					is_active: true,
					created_at: true,
					updated_at: true,
					classifications: {
						select: {
							classification: {
								select: {
									id: true,
									label: true,
									value: true
								}
							}
						}
					},
					packaging: {
						select: {
							id: true,
							label: true,
							value: true
						}
					},
					genericName: {
						select: {
							id: true,
							label: true,
							value: true
						}
					}
				}
			});

			return newMedicine;
		} catch (error) {
			console.error('Error creating medicine: ', error);
			throw new Error('Failed to create medicine');
		}
	}

	public async editMedicine(dataMedicine: Medicine): Promise<MedicineDisplayVO> {
		try {
			const newMedicine = await this.prisma.medicine.update({
				where: { id: dataMedicine.id },
				data: dataMedicine,
				select: {
					id: true,
					code: true,
					name: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
					sideEffect: true,
					is_active: true,
					created_at: true,
					updated_at: true,
					classifications: {
						select: {
							classification: {
								select: {
									id: true,
									label: true,
									value: true
								}
							}
						}
					},
					packaging: {
						select: {
							id: true,
							label: true,
							value: true
						}
					},
					genericName: {
						select: {
							id: true,
							label: true,
							value: true
						}
					}
				}
			});
			return newMedicine;
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

    public async checkExpiration(date: Date, month: Date): Promise<Medicine[]> {
        try {
            return this.prisma.medicine.findMany({
                where: {
                    expiredDate: {
                        lte: date,
                    },
                }
            })
        } catch (error) {
            console.error('Error checking expiration: ', error);
            throw new Error('Failed to check expiration');
        }
    }
}
