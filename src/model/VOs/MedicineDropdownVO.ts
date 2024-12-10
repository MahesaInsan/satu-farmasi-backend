import { $Enums, Prisma } from "@prisma/client";


export default interface MedicineData {
    id: number;
    code: string;
    name: string;
    batchCode: string;
    merk: string;
    currStock: number;
    minStock: number;
    reservedStock: number;
    maxStock: number;
    description: string;
    expiredDate: Date;
    price: Prisma.Decimal;
    unitOfMeasure: $Enums.UnitOfMeasure;
    sideEffect: string;
    classifications: {
        classification: {
            id: number;
            label: string;
            value: string;
        }
    }[];
    packaging: {
        id: number;
        label: string;
    };
    genericName: {
        id: number;
        label: string;
    };
}