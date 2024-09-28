"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = __importDefault(require("../repository/AdminRepository"));
const client_1 = require("@prisma/client");
const builder_pattern_1 = require("builder-pattern");
const CreateUserHelper_1 = __importDefault(require("./helper/CreateUserHelper"));
const DoctorService_1 = __importDefault(require("./DoctorService"));
const PharmacistService_1 = __importDefault(require("./PharmacistService"));
const EditUserHelper_1 = __importDefault(require("./helper/EditUserHelper"));
const UserService_1 = __importDefault(require("./UserService"));
class AdminService {
    constructor() {
        this.adminRepository = new AdminRepository_1.default();
        this.userService = new UserService_1.default();
        this.doctorService = new DoctorService_1.default();
        this.pharmacistService = new PharmacistService_1.default();
        this.createUserHelper = new CreateUserHelper_1.default();
        this.editUserHelper = new EditUserHelper_1.default();
    }
    addAdmin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.emailIsExist(request.email);
                request.password = yield this.userService.encryptPassword(request.password);
                const admin = this.createUserHelper.createBaseUser(request);
                return yield this.adminRepository.addAdmin((0, builder_pattern_1.Builder)(admin).role(client_1.Role.ADMIN).build());
            }
            catch (error) {
                throw error;
            }
        });
    }
    editAdmin(request) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("VO admin : ", request);
            const admin = this.editUserHelper.editBaseUser(request);
            return yield this.adminRepository.editAdmin((0, builder_pattern_1.Builder)(admin).role(client_1.Role.ADMIN).build());
        });
    }
    getAllAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminRepository.getAllAdmins();
        });
    }
    getAllStaff() {
        return __awaiter(this, void 0, void 0, function* () {
            const admins = yield this.adminRepository.getAllAdmins();
            const doctors = yield this.doctorService.getAllDoctors();
            const pharmacists = yield this.pharmacistService.getAllPharmacists();
            let users = [];
            admins.forEach(admin => {
                let user = admin;
                users.push(user);
            });
            doctors.forEach(doctor => {
                let user = doctor;
                users.push(user);
            });
            pharmacists.forEach(pharmacist => {
                let user = pharmacist;
                users.push(user);
            });
            return users;
        });
    }
    getStaffById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.adminRepository.getAdminById(id);
            if (admin)
                return admin;
            const doctor = yield this.doctorService.getDoctorById(id);
            if (doctor)
                return doctor;
            const pharmacist = yield this.pharmacistService.getPharmacistById(id);
            if (pharmacist)
                return pharmacist;
            return null;
        });
    }
    getStaffByNik(nik) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.adminRepository.getAdminByNik(nik);
            if (admin)
                return admin;
            const doctor = yield this.doctorService.getDoctorByNik(nik);
            if (doctor)
                return doctor;
            const pharmacist = yield this.pharmacistService.getPharmacistByNik(nik);
            if (pharmacist)
                return pharmacist;
            return null;
        });
    }
    editStaff(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role === client_1.Role.ADMIN)
                return yield this.editAdmin(user);
            if (user.role === client_1.Role.DOCTOR)
                return yield this.doctorService.editDoctor(user);
            if (user.role === client_1.Role.PHARMACIST)
                return yield this.pharmacistService.editPharmacist(user);
            return null;
        });
    }
}
exports.default = AdminService;
