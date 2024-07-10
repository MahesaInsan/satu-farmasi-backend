import AddAdminResponse from "../../model/response/AddAdminResponse";
import AddDoctorResponse from "../../model/response/AddDoctorResponse";
import AddPharmacistResponse from "../../model/response/AddPharmacistResponse";
import {Admin, Doctor, Pharmacist} from "@prisma/client";
import {Builder} from "builder-pattern";

export default class ResponseHelper{

    public construct400Response(message: string): object{
        return {
            message: message
        }
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