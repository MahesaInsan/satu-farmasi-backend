import {PaymentMethod} from "@prisma/client";

export default interface ConfirmPayRequest {
    id: number,
    paymentMethod: PaymentMethod
}