import BaseAddUserRequest from "../../model/request/BaseRequest/BaseAddUserRequest";
import User from "../../entity/User";
import {Builder} from "builder-pattern";

export default class CreateUserHelper<U extends BaseAddUserRequest, T extends User>{

    public createBaseUser(request: U): T{
        return Builder<T>()
            .is_active(true)
            .created_at(new Date())
            .updated_at(new Date())
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