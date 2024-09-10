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
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
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