import { Prisma } from "@prisma/client";

export default interface MedicineDisplayVO {
    id: number;
    code: string;
    name: string;
    merk: string;
    description: string;
    unitOfMeasure: string;
    price: Prisma.Decimal;
    expiredDate: Date;
    currStock: number;
    minStock: number;
    maxStock: number;
    sideEffect: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    genericName: {
        label: string;
    };
    packaging: {
        label: string;
    };
    classifications: {
        classification: {
            label: string;
        }
    }[];
}