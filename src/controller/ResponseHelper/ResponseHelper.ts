import BadRequest from "../../model/request/BadRequest";
import LoginRequest from "../../model/request/LoginRequest";
import AddAdminResponse from "../../model/response/AddAdminResponse";
import AddDoctorResponse from "../../model/response/AddDoctorResponse";
import AddPharmacistResponse from "../../model/response/AddPharmacistResponse";
import { Admin, Doctor, Pharmacist } from "@prisma/client";
import { Builder } from "builder-pattern";
import LoginResponse from "../../model/response/LoginResponse";
import Unauthorized from "../../model/request/UnauthorizedRequest";
import InternalServerRequest from "../../model/request/InteralServerRequest";
import User from "../../entity/User";
import SuccessRequest from "../../model/request/SuccessRequest";
import PaginationRequest from "../../model/request/PaginationRequest";
import { Result } from "express-validator";

export default class ResponseHelper {
    public constructCookieRequest(maxAge: number): object {
        return {
            httpOnly: true,
            secure: true,
            maxAge: maxAge
        };
    }

    public constructLoginResponse(user: Admin | Doctor | Pharmacist, token: string): LoginResponse {
        return Builder<LoginResponse>()
            .firstName(user.firstName)
            .lastName(user.lastName)
            .role(user.role)
            .token(token)
            .build();
    }

    public constructDeleteUserResponse(): string {
        return "Cookie deleted";
    }

    public constructInternalServerError(error: object): InternalServerRequest {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return Builder<InternalServerRequest>()
            .message("Internal Server Error")
            .Code(500)
            .error(errorMessage)
            .build();
    }

    public constructUnAuthorizedRequest(error: object): Unauthorized {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return Builder<Unauthorized>()
            .message("You have no access to this page!")
            .Code(401)
            .error(errorMessage)
            .build();
    }

    public constructBadRequest(error: object | Array<Object>): BadRequest {
        let errorMessage = "Something is wrong";
        let errors: Array<Object> = [];

        if (error instanceof Error) errorMessage = error.message;
        else if (error instanceof Result) {
            errorMessage = "Validation Failed";
            errors.push(error.mapped());
            return Builder<BadRequest>()
                .error("Bad Request")
                .Code(400)
                .message(errorMessage)
                .errors(errors)
                .build();
        }

        return Builder<BadRequest>()
            .error("Bad Request")
            .Code(400)
            .message(errorMessage)
            .build();
    }

    public constructAddPharmacistResponse(
        pharmacist: Pharmacist
    ): AddPharmacistResponse {
        return Builder<AddPharmacistResponse>()
            .nik(pharmacist.nik)
            .email(pharmacist.email)
            .firstName(pharmacist.firstName)
            .lastName(pharmacist.lastName)
            .phoneNum(pharmacist.phoneNum)
            .dob(pharmacist.dob)
            .role(pharmacist.role)
            .build();
    }

    public constructAddDoctorResponse(doctor: Doctor): AddDoctorResponse {
        return Builder<AddDoctorResponse>()
            .nik(doctor.nik)
            .email(doctor.email)
            .firstName(doctor.firstName)
            .lastName(doctor.lastName)
            .phoneNum(doctor.phoneNum)
            .dob(doctor.dob)
            .role(doctor.role)
            .build();
    }

    public constructAddAdminResponse(admin: Admin): AddAdminResponse {
        return Builder<AddAdminResponse>()
            .nik(admin.nik)
            .email(admin.email)
            .firstName(admin.firstName)
            .lastName(admin.lastName)
            .phoneNum(admin.phoneNum)
            .dob(admin.dob)
            .role(admin.role)
            .build();
    }

    public constructGetStaffResponse(staff: User | User[] | null): SuccessRequest {
        return Builder<SuccessRequest>()
            .code(200)
            .status("Success get staff data")
            .data(staff)
            .build();
    }

    public constructEditStaffResponse(staff: User | null): SuccessRequest {
        return Builder<SuccessRequest>()
            .code(200)
            .status("Success edit staff data")
            .data(staff)
            .build();
    }

    public constructPaginationResponse(pagination: PaginationRequest): PaginationRequest {
        return Builder<PaginationRequest>()
            .next(pagination.next)
            .previous(pagination.previous)
            .results(pagination.results)
            .total(pagination.total)
            .build();
    }
}
