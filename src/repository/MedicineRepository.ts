import { Medicine, Prisma, PrismaClient } from "@prisma/client"
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import MedicineData from "../model/VOs/MedicineDropdownVO"
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import TotalMedicineGroupByCodeVO from "../model/VOs/TotalMedicineGroupByCodeVO";
import { CustomError } from "../validator/helper/ErrorHelper";
import TotalMedicineGroupByCode from "../model/VOs/TotalMedicineGroupByCodeVO";

export default class MedicineRepository {
	private prisma: PrismaClient

	constructor() {
		this.prisma = new PrismaClient()
	}

	public async fetchMedicineList(): Promise<MedicineDropdownVO[]> {
		try {
			const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
			return await this.prisma.$queryRaw<MedicineDropdownVO[]>(
				Prisma.sql`
					SELECT 
						MIN(m.id) as id,
						m.code,
						MIN(m.name) as name,
						CAST(SUM(m."currStock" - m."reservedStock") AS INTEGER) as "currStock",
						MIN(m."minStock") as "minStock",
						MIN(m.price) as "price",
						MIN(m."maxStock") as "maxStock",
						MIN(m.description) as "description",
						MIN(m."expiredDate") as "expiredDate",
						MIN(m."unitOfMeasure") as "unitOfMeasure",
						MIN(m."sideEffect") as "sideEffect",
						jsonb_agg(
						  DISTINCT jsonb_build_object(
							 'id', c.id,
							 'label', c.label,
							 'value', c.value
						  )
						) as classifications,
						json_build_object(
							'id', MIN(p.id),
							'label', MIN(p.label)
						) as packaging,
						json_build_object(
							'id', MIN(g.id),
							'label', MIN(g.label)
						) as "genericName"
					FROM "Medicine" m
					INNER JOIN "Packaging" p
					ON m."packagingId" = p.id
					INNER JOIN "GenericName" g
					ON m."genericNameId" = g.id
					INNER JOIN "MedicineHasClassification" mhc
					ON m."id" = mhc."medicineId"
					INNER JOIN "Classification" c
					ON mhc."classificationId" = c."id"
					WHERE 
						m.is_active = true
						AND m."currStock" > 0
						AND m."expiredDate" > ${futureDate}
					GROUP BY 
						m.code
					HAVING 
						SUM(m."currStock") > 0
					ORDER BY
						m.code ASC
            `
			);
		} catch (error) {
			console.error('Error getting medicineList:', error);
			throw new Error('Failed to get medicineList');
		}
	}

	public async setMedicineIsActiveToFalse(medicineId: number) {
		try {
			await this.prisma.medicine.update({
				where: { id: medicineId },
				data: { is_active: false }
			})
		} catch (error) {
			throw new Error("Failed to change medicine is_active to false")
		}
	}

	public async fetchMedicineListById(): Promise<MedicineDropdownVO[]> {
		try {
			return this.prisma.medicine.findMany({
				where: {
					is_active: true,
					currStock: {
						gt: 0
					},
				},
				select: {
					id: true,
					code: true,
					name: true,
					merk: true,
					currStock: true,
					minStock: true,
					reservedStock: true,
					expiredDate: true,
					maxStock: true,
					description: true,
					unitOfMeasure: true,
					sideEffect: true,
					price: true,
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
		} catch (error) {
			console.error('Error getting medicineList:', error);
			throw new Error('Failed to get medicineList');
		}
	}

	public async getSingleMedicineById(id: number): Promise<Medicine | null> {
		try {
			return this.prisma.medicine.findFirst({ where: { id: id } });
		} catch (error) {
			console.error('Error getting medicine by id:', error);
			throw new Error('Failed to get medicine by id');
		}
	}

	public async getMedicineByCodeInAndIsActiveTrue(medicineCodes: string[]): Promise<MedicineData[]> {
		return this.prisma.medicine.findMany({
			where: {
				code: {
					in: medicineCodes
				},
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
				reservedStock: true,
				price: true,
				maxStock: true,
				description: true,
				expiredDate: true,
				unitOfMeasure: true,
				sideEffect: true,
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
						label: true
					}
				},
				genericName: {
					select: {
						id: true,
						label: true
					}
				}
			},
			orderBy: {
				expiredDate: 'asc'
			}
		});
	}

	//PATH NYA DIM
	public async decreaseStock(medicineId: number, quantity: number, path: string) {
		try {
			await this.validateMedicineId(medicineId, quantity)

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

	public async decreaseStockAndDecreaseReservedStock(medicineId: number, quantityStock: number, quantityReservedStock: number) {
		try {
			await this.validateMedicineId(medicineId, quantityStock)

			return await this.prisma.medicine.update({
				where: {
					id: medicineId
				},
				data: {
					currStock: {
						decrement: quantityStock
					},
					reservedStock: {
						decrement: quantityReservedStock
					}
				},
				select: {
					currStock: true
				}
			})
		} catch (error) {
			throw error as string
		}
	}

	public async increaseReserveStock(medicineId: number, quantity: number){
		try {
			await this.validateMedicineId(medicineId, quantity)

			await this.prisma.medicine.update({
				where: {
					id: medicineId
				},
				data: {
					reservedStock: {
						increment: quantity
					}
				}
			})
		} catch (error) {
			throw error as string
		}
	}

	public async decreaseReserveStock(medicineId: number, quantity: number){
		try {
			await this.prisma.medicine.update({
				where: {
					id: medicineId
				},
				data: {
					reservedStock: {
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

	public async getMedicineByCodeIn(medicineCodes: string[]): Promise<MedicineData[]> {
		try {
			const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
			return await this.prisma.$queryRaw<MedicineData[]>(
				Prisma.sql`
					SELECT 
						MIN(m.id) as id,
						m.code,
						MIN(m.name) as name,
						CAST(SUM(m."currStock" - m."reservedStock") AS INTEGER) as "currStock",
						MIN(m."reservedStock") as "reservedStock",
						MIN(m."minStock") as "minStock",
						MIN(m.price) as "price",
						json_build_object(
							'label', MIN(p.label)
						) as packaging,
						json_build_object(
							'label', MIN(g.label)
						) as genericName
					FROM "Medicine" m
					INNER JOIN "Packaging" p
					ON m."packagingId" = p.id
					INNER JOIN "GenericName" g
					ON m."genericNameId" = g.id
					WHERE 
						m.is_active = true
						AND m.code IN (${Prisma.join(medicineCodes)})
						AND m."currStock" > 0
						AND m."expiredDate" > ${futureDate}
					GROUP BY 
						m.code
					HAVING 
						SUM(m."currStock") > 0
					ORDER BY
						m.code ASC
            `
			);
		} catch (error) {
			console.error('Error getting medicineList:', error);
			throw new Error('Failed to get medicineList');
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

	public async getTotalSearchMedicines(parameter: string | undefined): Promise<number> {
		try {
			parameter === undefined ? parameter = "" : undefined
			return this.prisma.medicine.count({
				where: {
					OR: [
						{ name: {
								contains: parameter, mode: "insensitive"
							}},
						{ code: {
								contains: parameter, mode: "insensitive"
							}},
						{ merk: {
								contains: parameter, mode: "insensitive"
							}}
					]
				}
			})
		} catch (error) {
			console.error('Error coounting search medicineList: ', error);
			throw new Error('Failed to count medicineList');
		}
	}

	public async getTotalSearchMedicinesByCode(parameter: string | undefined): Promise<number> {
		try {
			parameter === undefined ? parameter = "" : undefined
			const distinctCount = await this.prisma.medicine.groupBy({
				by: ['code'],
				where: {
					AND: [
						{
							OR: [
								{ name: {
										contains: parameter, mode: "insensitive"
									}},
								{ code: {
										contains: parameter, mode: "insensitive"
									}},
								{ merk: {
										contains: parameter, mode: "insensitive"
									}}
							]
						},
						{
							is_active: true
						}
					]
				},
				_count: {
					code: true,
				}
			})
			return distinctCount.length;
		} catch (error) {
			console.error('Error coounting search medicineList: ', error);
			throw new Error('Failed to count medicineList');
		}
	}

	public async getAllMedicineCodeByCode(code: string) {
		try {
			return await this.prisma.medicine.findMany({
				where: {
					code: { contains: code }
				},
				select: {
					code: true
				}
			})
		} catch (error) {
			console.error('Error counting medicineList: ', error);
			throw new Error('Failed to count medicineList');
		}
	}

	public async getAllMedicineByGenericName(genericNameId: number) {
		try {
			return await this.prisma.medicine.findMany({
				where: {
					genericName: {
						id: genericNameId
					}
				}
			})
		} catch (error) {
			throw error as string;
		}
	}

    public async getTotalNeedToRestock(): Promise<number> {
        try {
            return this.prisma.medicine.count({
                where: {
                    currStock: {
                        lte: this.prisma.medicine.fields.minStock
                    }
                }
            })
        } catch (error) {
            console.error('Error get need to restock medicineList: ', error);
            throw new Error('Failed to get need to restock medicineList');
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

	public async getMedicineSummaryByCode(startIndex: number, limit: number, searchQuery: string | undefined,
										  sortBy: string | undefined, sortMode: string | undefined): Promise<MedicineDisplayVO[]> {
		try {
			const orderBy = sortBy && sortMode
				? `ORDER BY "${sortBy}" ${sortMode}`
				: `ORDER BY "code" ASC, "is_active" DESC`;

			return await this.prisma.$queryRaw`
				SELECT 
					"code",
					MAX("name") AS "name", 
					MAX("merk") AS "merk",
					MAX("description") AS "description",
					MAX("unitOfMeasure") AS "unitOfMeasure",
					MAX("price") AS "price",
					MAX("expiredDate") AS "expiredDate",
					CAST(SUM("currStock") AS INTEGER) AS "currStock",
					MAX("minStock") AS "minStock",
					MAX("maxStock") AS "maxStock",
					CASE WHEN COUNT(CASE WHEN m."is_active" = false THEN 1 END) > 0 THEN false ELSE true END AS "is_active",
					MAX("sideEffect") AS "sideEffect",
					MAX(m."created_at") AS "created_at",
					MAX(m."updated_at") AS "updated_at",
					jsonb_agg(
						  DISTINCT jsonb_build_object(
							 'id', c.id,
							 'label', c.label,
							 'value', c.value
						  )
						) as classifications,
					json_build_object(
						'id', MAX(p.id),
						'label', MAX(p.label)
					) as packaging,
					json_build_object(
						'id', MAX(g.id),
						'label', MAX(g.label)
					) as "genericName"
				FROM "Medicine" m
					INNER JOIN "Packaging" p
					ON m."packagingId" = p.id
					INNER JOIN "GenericName" g
					ON m."genericNameId" = g.id
					INNER JOIN "MedicineHasClassification" mhc
					ON m."id" = mhc."medicineId"
					INNER JOIN "Classification" c
					ON mhc."classificationId" = c."id"
				WHERE 
					"name" ILIKE ${`%${searchQuery}%`} 
					OR "code" ILIKE ${`%${searchQuery}%`} 
					OR "merk" ILIKE ${`%${searchQuery}%`}
				GROUP BY "code"
				${Prisma.sql([orderBy])}
				LIMIT ${limit} OFFSET ${startIndex};
			`;
		} catch (error) {
			throw error as string
		}
	}

	public async getMedicineSummaryById(startIndex: number, limit: number, searchQuery: string | undefined,
										sortBy: string | undefined, sortMode: string | undefined): Promise<MedicineDisplayVO[]> {
		try {
			const orderBy: Prisma.MedicineOrderByWithRelationInput[] = [];

			if (sortBy && sortMode) {
				orderBy.push({ [sortBy]: sortMode as Prisma.SortOrder });
			}
			orderBy.push({ id: "asc" });
			orderBy.push({ is_active: "desc" });

			return this.prisma.medicine.findMany({
				where: {
					OR: [
						{ name: {
							contains: searchQuery, mode: "insensitive"
						}},
						{ code: {
							contains: searchQuery, mode: "insensitive"
						}},
						{ merk: {
							contains: searchQuery, mode: "insensitive"
						}}
					]
				},
				orderBy: orderBy,
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

	public async updateActiveMedicine(dataMedicine: Medicine) {
		try {
			await this.prisma.medicine.updateMany({
				where: {
					AND: [
						{ code: dataMedicine.code },
						{ is_active: true}
					]
				},
				data: dataMedicine
			});
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

	public async updateAllMedicine(medicineList: Medicine[]) {
		try {
			await this.prisma.medicine.updateMany({
				data: medicineList
			});
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

	public async updateInactiveMedicine(dataMedicine: Medicine) {
		try {
			await this.prisma.medicine.updateMany({
				where: {
					AND: [
						{ code: dataMedicine.code },
						{ is_active: false}
					]
				},
				data: dataMedicine
			});
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

	public async findAllMedicineIdByMedicineCode(medicineCode: string) {
		try {
			return await this.prisma.medicine.findMany({
				where: {
					code: medicineCode
				},
				select: {
					id: true
				}
			});
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

	public async editMedicineByCode(dataMedicine: Medicine) {
		try {
			return await this.prisma.medicine.updateMany({
				where: { code: dataMedicine.code },
				data: dataMedicine
			});
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

    public async checkExpiration(startDay: Date, lastDay: Date): Promise<Medicine[]> {
        try {
            return this.prisma.medicine.findMany({
                where: {
                    expiredDate: {
                        gte: startDay,
                        lte: lastDay,
                    },
                }
            })
        } catch (error) {
            console.error('Error checking expiration: ', error);
            throw new Error('Failed to check expiration');
        }
    }

	public async checkIfMedicineExpiredTodayStillActive(startDate: Date, endDate: Date): Promise<Medicine[]> {
		try {
			return this.prisma.medicine.findMany({
				where: {
					AND:
						[
							{
								expiredDate: {
									// gte: startDate,
									lte: endDate
								}
							},
							{
								OR:
									[
										{is_active: true},
										{currStock: {
											gt: 0
										}}
									]
							}
						]

				}
			})
		} catch (error) {
			console.error('Error checking medicine expired still active with error: ', error)
			throw error as string
		}
	}

	private async validateMedicineId(medicineId: number, quantity: number) {
		try {
			const medicine: Medicine | null = await this.getMedicineById(medicineId);
			if (!medicine) {
				throw new CustomError().formatError("Medicine Not Found", "medicineId");
			}

			console.log(quantity, medicine!.currStock);

			if (medicine && medicine.currStock - quantity < 0) {
				throw new CustomError().formatError("Medicine stock is not enough", "quantity");
			}
		} catch (error) {
			throw error as string
		}
	}
}
