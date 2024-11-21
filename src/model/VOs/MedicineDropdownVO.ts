import { Prisma } from "@prisma/client";


export default interface MedicineData {
    id: number;
    code: string;
    name: string;
    merk: string;
    currStock: number;
    minStock: number;
    reservedStock: number;
    price: Prisma.Decimal;
    packaging: {
        label: string;
    };
    genericName: {
        label: string;
    };
}