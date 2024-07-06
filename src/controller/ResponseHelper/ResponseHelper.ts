import AddAdminResponse from "../../model/response/AddAdminResponse";
import {Admin} from "@prisma/client";
import {Builder} from "builder-pattern";

export default class ResponseHelper{

    public constructAdminResponse(admin: Admin): AddAdminResponse{
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