import { Builder } from "builder-pattern";
import BaseEntity from "../../entity/BaseEntity";
import { Vendor } from "@prisma/client";
import EditVendorRequest from "../../model/request/EditVendorRequest";
import AddVendorRequest from "../../model/request/AddVendorRequest";

export default class VendorHelper {
    public createVendor(request: AddVendorRequest): Vendor {
        return Builder<Vendor>()
            .name(request.name)
            .phoneNum(request.phoneNum.toString())
            .address(request.address)
            .city(request.city)
            .is_active(true)
            .created_at(new Date())
            .build();
    }

    public editVendor(request: EditVendorRequest): Vendor {
        return Builder<Vendor>()
            .id(request.id)
            .name(request.name)
            .phoneNum(request.phoneNum.toString())
            .address(request.address)
            .city(request.city)
            .is_active(request.is_active || false)
            .updated_at(new Date())
            .build();
    }
}
