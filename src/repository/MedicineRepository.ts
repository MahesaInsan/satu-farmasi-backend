import { Medicine, Prisma, PrismaClient } from "@prisma/client"
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import MedicineData from "../model/VOs/MedicineDropdownVO"
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import TotalNeedToRestockVO from "../model/VOs/TotalNeedToRestockVO";
import { CustomError } from "../validator/helper/ErrorHelper";
import BaseRepository from "./helper/BaseRepository";

export default class MedicineRepository extends BaseRepository{

	constructor() {
		super();
	}

	public async fetchMedicineList(isActive?: boolean, isPrescription?: boolean): Promise<MedicineDropdownVO[]> {
		try {
			const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
			let conditions: Prisma.Sql[] = [];

			if (isActive) {
				conditions.push(Prisma.sql`m.is_active = ${isActive}`);
				conditions.push(Prisma.sql`m."currStock" > 0`);
			}
			if (isPrescription) {
				conditions.push(Prisma.sql`m."expiredDate" > ${futureDate}`);
			}

			const whereClause = conditions.length > 0
				? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
				: Prisma.empty

			console.log('Where Clause:', whereClause);

			return await this.Prisma.$queryRaw<MedicineDropdownVO[]>(
				Prisma.sql`
                    WITH flattened_classifications AS (
                        SELECT
                            MIN(id) as id,
                            code,
                            MIN("name") as "name",
                            MIN("merk") as "merk",
                            MIN("description") as "description",
							CAST(SUM("currStock") AS INTEGER) AS "currStock",
							CAST(SUM("reservedStock") AS INTEGER) AS "reservedStock",
                            MIN("price") as "price",
                            MIN("minStock") as "minStock",
                            MIN("maxStock") as "maxStock",
                            MIN("expiredDate") as "expiredDate",
                            MIN("unitOfMeasure") as "unitOfMeasure",
                            MIN("sideEffect") as "sideEffect",
                            jsonb_array_elements(classifications) AS classification,
                            packaging,
                            "genericName"
                        FROM (
                            SELECT
                                MIN(m.id) as id,
                                m.code,
                                MIN(m.name) as "name",
                                MIN(m.merk) as "merk",
                                MIN(m.description) as "description",
								CAST(SUM("currStock") AS INTEGER) AS "currStock",
								CAST(SUM("reservedStock") AS INTEGER) AS "reservedStock",
                                MIN(m.price) AS "price",
                                MIN(m."minStock") AS "minStock",
                                MIN(m."maxStock") AS "maxStock",
                                MIN(m."expiredDate") AS "expiredDate",
                                MIN(m."unitOfMeasure") AS "unitOfMeasure",
                                MIN(m."sideEffect") AS "sideEffect",
                                jsonb_agg(
                                    DISTINCT jsonb_build_object(
                                        'id', c.id,
                                        'label', c.label,
                                        'value', c.value
                                    )
                                ) AS classifications,
                                jsonb_build_object(
                                    'id', MIN(p.id),
                                    'label', MIN(p.label)
                                ) AS packaging,
                                jsonb_build_object(
                                    'id', MIN(g.id),
                                    'label', MIN(g.label)
                                ) AS "genericName"
                            FROM "Medicine" m
                            INNER JOIN "Packaging" p ON m."packagingId" = p.id
                            INNER JOIN "GenericName" g ON m."genericNameId" = g.id
                            INNER JOIN "MedicineHasClassification" mhc ON m.id = mhc."medicineId"
                            INNER JOIN "Classification" c ON mhc."classificationId" = c.id
                            ${whereClause}
                            GROUP BY m.code, m.id, mhc."classificationId"
                        ) subquery
                        GROUP BY
                            code, packaging, "genericName", classification
                    )
                    SELECT
                        MIN(id) as id,
                        code,
                        MIN("name") as "name",
                        MIN("merk") as "merk",
                        MIN("description") as "description",
                        "currStock",
                        MIN("reservedStock") AS "reservedStock",
                        MIN("price") as "price",
                        MIN("minStock") as "minStock",
                        MIN("maxStock") as "maxStock",
                        MIN("expiredDate") as "expiredDate",
                        MIN("unitOfMeasure") as "unitOfMeasure",
                        MIN("sideEffect") as "sideEffect",
                        jsonb_agg(DISTINCT classification) AS classifications,
                        packaging,
                        "genericName"
                    FROM flattened_classifications
                    GROUP BY code, packaging, "genericName", "currStock"`
			);
		} catch (error) {
			console.error('Error getting medicineList:', error);
			throw new Error('Failed to get medicineList');
		}
	}

	public async setMedicineIsActiveToFalse(medicineId: number) {
		try {
			await this.Prisma.medicine.update({
				where: { id: medicineId },
				data: { is_active: false }
			})
		} catch (error) {
			throw new Error("Failed to change medicine is_active to false")
		}
	}

	public async fetchMedicineListById(): Promise<MedicineDropdownVO[]> {
		try {
			return this.Prisma.medicine.findMany({
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
					batchCode: true,
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
			return this.Prisma.medicine.findFirst({ where: { id: id } });
		} catch (error) {
			console.error('Error getting medicine by id:', error);
			throw new Error('Failed to get medicine by id');
		}
	}

    public async getMedicineByCodeInAndIsActiveTrue(medicineCodes: string[], expiredDate?: boolean): Promise<MedicineData[]> {
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        
        return this.Prisma.medicine.findMany({
            where: {
                code: {
                    in: medicineCodes
                },
                is_active: true,
                ...(expiredDate ? {
                    expiredDate: {
                        gt: futureDate
                    }
                } : {}),
                currStock: {
                    gt: 0
                },
            },
            select: {
                id: true,
                code: true,
                name: true,
                batchCode: true,
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

	public async decreaseStock(medicineId: number, quantity: number, path: string) {
		try {
			await this.validateMedicineId(medicineId, quantity)

			await this.Prisma.medicine.update({
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

			return await this.Prisma.medicine.update({
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

			await this.Prisma.medicine.update({
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
			await this.Prisma.medicine.update({
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
			await this.Prisma.medicine.update({
				where: {
					id: medicineId,
				},
				data: {
					currStock: {
						increment: quantity
					},
                    is_active: true
				}
			})
		} catch (error) {
			throw error as string
		}
	}

	public async getMedicineByIdIn(medicineId: number[]) {
		try {
			return this.Prisma.medicine.findMany({
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
			return await this.Prisma.$queryRaw<MedicineData[]>(
				Prisma.sql`
					SELECT 
						MIN(m.id) as id,
						m.code,
						MIN(m.name) as name,
						MIN(m."batchCode") as "batchCode",
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

	//NOT NEEDED NO MORE
	public async getTotalMedicines(): Promise<number> {
		try {
			return this.Prisma.medicine.count({ where: { is_active: true } })
		} catch (error) {
			console.error('Error counting medicineList: ', error);
			throw new Error('Failed to count medicineList');
		}
	}

	public async getTotalSearchMedicines(parameter: string | undefined): Promise<number> {
		try {
			parameter === undefined ? parameter = "" : undefined
			return this.Prisma.medicine.count({
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
			const distinctCount = await this.Prisma.medicine.groupBy({
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
			return await this.Prisma.medicine.findMany({
				where: {
					code: {
						contains: code,
						mode: "insensitive"
					}
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
			return await this.Prisma.medicine.findMany({
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
            const total: string[] = await this.Prisma.$queryRaw(
				Prisma.sql`
				WITH AggregatedData AS (
					SELECT
						"code",
						SUM("currStock") AS "currStock",
						MIN("minStock") AS "minStock"
					FROM "public"."Medicine"
					GROUP BY "code"
				)
				SELECT 
					MIN("code") AS "code",
					SUM("currStock") AS "currStock",
					MIN("minStock") AS "minStock"
				FROM AggregatedData
				WHERE "currStock" <= "minStock"
				GROUP BY "code";
				`
			)

			return total.length
        } catch (error) {
            console.error('Error get need to restock medicineList: ', error);
            throw new Error('Failed to get need to restock medicineList');
        }
    }

	//UNUSED
	public async getMedicines(startIndex: number, limit: number): Promise<MedicineDisplayVO[]> {
		try {
			return this.Prisma.medicine.findMany({
				where: { is_active: true },
				skip: startIndex,
				take: limit,
				select: {
					id: true,
					code: true,
					name: true,
					merk: true,
					batchCode: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
                    reservedStock: true,
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

            return await this.Prisma.$queryRaw<MedicineDisplayVO[]>(Prisma.sql`
				WITH flattened_classifications AS (
					SELECT
					  	"code",
				  		MIN(id) AS id,
					  	MIN("name") AS "name", 
					  	MIN("merk") AS "merk",
					  	MIN("description") AS "description",
					  	MIN("unitOfMeasure") AS "unitOfMeasure",
					  	MIN("price") AS "price",
					  	MIN("expiredDate") AS "expiredDate",
					  	CAST(SUM("currStock") AS INTEGER) AS "currStock",
					  	CAST(SUM("reservedStock") AS INTEGER) AS "reservedStock",
					  	MIN("minStock") AS "minStock",
					  	MIN("maxStock") AS "maxStock",
					  	CASE WHEN COUNT(CASE WHEN "is_active" = false THEN 1 END) > 0 THEN false ELSE true END AS "is_active",
					  	MIN("sideEffect") AS "sideEffect",
					  	MIN("created_at") AS "created_at",
					  	MIN("updated_at") AS "updated_at",
						jsonb_array_elements(classifications) AS classification,
						packaging,
						"genericName"
					FROM (
						SELECT 
							  "code",
							  MIN(m.id) AS id,
							  MIN(m."name") AS "name", 
							  MIN(m."merk") AS "merk",
							  MIN(m."description") AS "description",
							  MIN(m."unitOfMeasure") AS "unitOfMeasure",
							  MIN(m."price") AS "price",
							  MIN(m."expiredDate") AS "expiredDate",
							  CAST(SUM("currStock") AS INTEGER) AS "currStock",
							  CAST(SUM("reservedStock") AS INTEGER) AS "reservedStock",
							  MIN(m."minStock") AS "minStock",
							  MIN(m."maxStock") AS "maxStock",
							  CASE WHEN COUNT(CASE WHEN m."is_active" = false THEN 1 END) > 0 THEN false ELSE true END AS "is_active",
							  MIN(m."sideEffect") AS "sideEffect",
							  MIN(m."created_at") AS "created_at",
							  MIN(m."updated_at") AS "updated_at",
							  jsonb_agg(
								DISTINCT jsonb_build_object(
								  'id', c.id,
								  'label', c.label,
								  'value', c.value
								)
							  ) AS classifications,
								jsonb_build_object(
								'id', MIN(p.id),
								'label', MIN(p.label)
							  ) AS packaging,
								jsonb_build_object(
								'id', MIN(g.id),
								'label', MIN(g.label)
							  ) AS "genericName"
						FROM "Medicine" m
						INNER JOIN "Packaging" p ON m."packagingId" = p.id
						INNER JOIN "GenericName" g ON m."genericNameId" = g.id
						INNER JOIN "MedicineHasClassification" mhc ON m."id" = mhc."medicineId"
						INNER JOIN "Classification" c ON mhc."classificationId" = c."id"
						WHERE 
				  			("name" ILIKE ${`%${searchQuery}%`} 
				  			OR "code" ILIKE ${`%${searchQuery}%`} 
				  			OR "merk" ILIKE ${`%${searchQuery}%`})
						GROUP BY m.code, m.id, mhc."classificationId"
						${Prisma.sql([orderBy])}
					) subquery
				GROUP BY
				code, packaging, "genericName", classification
			)
				SELECT
				 	"code",
				  	MIN(id) AS id,
				  	MIN("name") AS "name", 
				  	MIN("merk") AS "merk",
				  	MIN("description") AS "description",
				  	MIN("unitOfMeasure") AS "unitOfMeasure",
				  	MIN("price") AS "price",
				  	MIN("expiredDate") AS "expiredDate",
					"currStock",
			  		MIN("reservedStock") AS "reservedStock",
				  	MIN("minStock") AS "minStock",
				  	MIN("maxStock") AS "maxStock",
				  	CASE WHEN COUNT(CASE WHEN "is_active" = true THEN 1 END) > 0 THEN true ELSE false END AS "is_active",
				  	MIN("sideEffect") AS "sideEffect",
				  	MIN("created_at") AS "created_at",
				  	MIN("updated_at") AS "updated_at",
					jsonb_agg(DISTINCT classification) AS classifications,
					packaging,
					"genericName"
				FROM flattened_classifications
				GROUP BY code, packaging, "genericName", "currStock"
				LIMIT ${limit} OFFSET ${startIndex}
			`);
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

			return this.Prisma.medicine.findMany({
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
					batchCode: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
                    reservedStock: true,
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
			return this.Prisma.medicine.findFirst({ where: { id: id } });
		} catch (error) {
			console.error('Error getting medicine by id:', error);
			throw new Error('Failed to get medicine by id');
		}
	}

	public async getMedicineByCode(code: string): Promise<MedicineDisplayVO | null> {
		try {
			return this.Prisma.medicine.findFirst({
				where: {
					code: code
				},
				select: {
					id: true,
					code: true,
					name: true,
					batchCode: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
                    reservedStock: true,
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

	//UNUSED
	public async searchMedicines(startIndex: number, limit: number, parameter: string): Promise<MedicineDisplayVO[]> {
		try {
			return this.Prisma.medicine.findMany({
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
					batchCode: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
                    reservedStock: true,
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
			const newMedicine = await this.Prisma.medicine.create({
				data: dataMedicine,
				select: {
					id: true,
					code: true,
					name: true,
					batchCode: true,
					merk: true,
					description: true,
					unitOfMeasure: true,
					price: true,
					expiredDate: true,
					currStock: true,
					minStock: true,
					maxStock: true,
                    reservedStock: true,
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

	public async updateActiveMedicine(oldMedicineCode: string, dataMedicine: Medicine) {
		try {
			await this.Prisma.medicine.updateMany({
				where: {
					AND: [
						{ code: oldMedicineCode },
						{ is_active: true}
					]
				},
				data: {
					...dataMedicine
				}
			});
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

	public async updateAllMedicine(medicineList: Medicine[]) {
		const updatePromises = medicineList.map(medicine =>
			this.Prisma.medicine.update({
				where: { id: medicine.id },
				data: { code: medicine.code }
			})
		);
		await Promise.all(updatePromises);
	}

	public async updateInactiveMedicine(oldMedicineCode: string, dataMedicine: Medicine): Promise<number> {
		try {
			const result = await this.Prisma.medicine.updateMany({
				where: {
					AND: [
						{ code: oldMedicineCode },
						{ is_active: false}
					]
				},
				data: {
					...dataMedicine
				}
			});
			return result.count;
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

	public async activateMedicineById(medicineId: number) {
		try {
			await this.Prisma.medicine.update({
				where: {
					id: medicineId
				},
				data: {
					is_active: true
				}
			})
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

	public async findAllMedicineIdByMedicineCode(medicineCode: string) {
		try {
			return await this.Prisma.medicine.findMany({
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
			return await this.Prisma.medicine.updateMany({
				where: { code: dataMedicine.code },
				data: dataMedicine
			});
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

	public async editMedicineById(dataMedicine: Medicine) {
		try {
			return await this.Prisma.medicine.update({
				where: { id: dataMedicine.id },
				data: dataMedicine
			});
		} catch (error) {
			console.error('Error editing medicine: ', error);
			throw new Error('Failed to edit medicine');
		}
	}

    public async checkExpiration(startDay: Date, lastDay: Date): Promise<Medicine[]> {
        try {
            return this.Prisma.medicine.findMany({
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
			return this.Prisma.medicine.findMany({
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

	public async hardDeleteMedicineById(medicineId: number) {
		try {
			return this.Prisma.medicine.delete({
				where: {
					id: medicineId
				}
			})
		} catch (error) {
			console.error('Error delete medicine by id: ', error);
			throw new Error('Failed to delete medicine by id');
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
