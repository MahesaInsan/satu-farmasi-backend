import {PaymentMethod} from "@prisma/client";
import AddPhysicalReportRequest from "./AddPhysicalReportRequest";

export default interface ConfirmPayRequest {
    id: number,
    paymentMethod: PaymentMethod,
    physicalReport: AddPhysicalReportRequest;
}