import BadRequest from "../../model/request/BadRequest";
import LoginRequest from "../../model/request/LoginRequest";
import AddAdminResponse from "../../model/response/AddAdminResponse";
import AddDoctorResponse from "../../model/response/AddDoctorResponse";
import AddPharmacistResponse from "../../model/response/AddPharmacistResponse";
import {Admin, Doctor, Pharmacist} from "@prisma/client";
import {Builder} from "builder-pattern";
import LoginResponse from "../../model/response/LoginResponse";
import Unauthorized from "../../model/request/UnauthorizedRequest";
import InternalServerRequest from "../../model/request/InteralServerRequest";

export default class ResponseHelper{

    public constructCookieRequest(): object{
        return {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        }
    }

    public constructLoginResponse(user: Admin | Doctor | Pharmacist, token: string): LoginResponse{
        return Builder<LoginResponse>()
            .firstName(user.firstName)
            .lastName(user.lastName)
            .token(token)
            .build()
    }

    public constructInternalServerError(error: object): InternalServerRequest{
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return Builder<InternalServerRequest>()
        .message("Internal Server Error")
        .Code(500)
        .error(errorMessage)
        .build()
    }

    public constructUnAuthorizedRequest(error: object): Unauthorized {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return Builder<Unauthorized>()
        .message("You have no access to this page!")
        .Code(401)
        .error(errorMessage)
        .build()
    }

    public constructBadRequest(error: object): BadRequest{
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return Builder<BadRequest>()
        .message("Data not found!")
        .Code(400)
        .error(errorMessage)
        .build()
    }

    public constructAddPharmacistResponse(pharmacist: Pharmacist): AddPharmacistResponse{
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
        
    public constructAddDoctorResponse(doctor: Doctor): AddDoctorResponse{
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

    public constructAddAdminResponse(admin: Admin): AddAdminResponse{
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
}