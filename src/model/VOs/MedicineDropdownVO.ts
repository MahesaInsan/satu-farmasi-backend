import { Prisma } from "@prisma/client";


export default interface MedicineData {
    id: number;
    code: string;
    name: string;
    merk: string;
    currStock: number;
    price: Prisma.Decimal;
    classifications: {
        classification: {
            label: string;
        }
    }[];
    packaging: {
        label: string;
    };
    genericName: {
        label: string;
    };
}