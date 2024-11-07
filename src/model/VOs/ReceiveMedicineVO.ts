import { $Enums, Prisma } from "@prisma/client";

export default interface ReceiveMedicineVO {
    id: number;
    documentNumber: string;
    batchCode: string;
    medicine: {
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
            id: number;
            label: string;
            value: string;
        };
        packaging: {
            id: number;
            label: string;
            value: string;
        };
    };
    quantity: number;
    vendorId: number;
    buyingPrice: Prisma.Decimal;
    paymentMethod: $Enums.PaymentMethod;
    deadline: Date;
    isPaid: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    reportId: number | null;
}