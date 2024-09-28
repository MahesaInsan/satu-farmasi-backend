"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_pattern_1 = require("builder-pattern");
class ResponseHelper {
    constructCookieRequest(maxAge) {
        return {
            httpOnly: true,
            secure: true,
            maxAge: maxAge
        };
    }
    constructLoginResponse(user, token) {
        return (0, builder_pattern_1.Builder)()
            .firstName(user.firstName)
            .lastName(user.lastName)
            .role(user.role)
            .token(token)
            .build();
    }
    constructDeleteUserResponse() {
        return "Cookie deleted";
    }
    constructInternalServerError(error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return (0, builder_pattern_1.Builder)()
            .message("Internal Server Error")
            .Code(500)
            .error(errorMessage)
            .build();
    }
    constructUnAuthorizedRequest(error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return (0, builder_pattern_1.Builder)()
            .message("You have no access to this page!")
            .Code(401)
            .error(errorMessage)
            .build();
    }
    constructBadRequest(error) {
        const errorMessage = error instanceof Error ? error.message : "Validation Failed!";
        let errors = [];
        error instanceof Object
            ? errors.push(error)
            : errors = error;
        return (0, builder_pattern_1.Builder)()
            .error("Data not found!")
            .Code(404)
            .message(errorMessage)
            .errors(errors)
            .build();
    }
    constructAddPharmacistResponse(pharmacist) {
        return (0, builder_pattern_1.Builder)()
            .nik(pharmacist.nik)
            .email(pharmacist.email)
            .firstName(pharmacist.firstName)
            .lastName(pharmacist.lastName)
            .phoneNum(pharmacist.phoneNum)
            .dob(pharmacist.dob)
            .role(pharmacist.role)
            .build();
    }
    constructAddDoctorResponse(doctor) {
        return (0, builder_pattern_1.Builder)()
            .nik(doctor.nik)
            .email(doctor.email)
            .firstName(doctor.firstName)
            .lastName(doctor.lastName)
            .phoneNum(doctor.phoneNum)
            .dob(doctor.dob)
            .role(doctor.role)
            .build();
    }
    constructAddAdminResponse(admin) {
        return (0, builder_pattern_1.Builder)()
            .nik(admin.nik)
            .email(admin.email)
            .firstName(admin.firstName)
            .lastName(admin.lastName)
            .phoneNum(admin.phoneNum)
            .dob(admin.dob)
            .role(admin.role)
            .build();
    }
    constructGetStaffResponse(staff) {
        return (0, builder_pattern_1.Builder)()
            .code(200)
            .status("Success get staff data")
            .data(staff)
            .build();
    }
    constructEditStaffResponse(staff) {
        return (0, builder_pattern_1.Builder)()
            .code(200)
            .status("Success edit staff data")
            .data(staff)
            .build();
    }
    constructPaginationResponse(pagination) {
        return (0, builder_pattern_1.Builder)()
            .next(pagination.next)
            .previous(pagination.previous)
            .results(pagination.results)
            .total(pagination.total)
            .build();
    }
}
exports.default = ResponseHelper;
