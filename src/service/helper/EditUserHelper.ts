import User from "../../entity/User";
import {Builder} from "builder-pattern";
import BaseEditUserRequest from "../../model/request/BaseRequest/BaseEditUserRequest";

export default class EditUserHelper<U extends BaseEditUserRequest, T extends User>{

    public editBaseUser(request: U): T{
        return Builder<T>()
            .is_active(request.is_active)
            .created_at(request.createdAt)
            .updated_at(new Date())
            .id(request.id)
            .nik(request.nik)
            .email(request.email)
            .password(request.password)
            .firstName(request.firstName)
            .lastName(request.lastName)
            .dob(request.dob)
            .phoneNum(request.phoneNum)
            .build();
    }
}