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
const client_1 = require("@prisma/client");
const builder_pattern_1 = require("builder-pattern");
const CreateUserHelper_1 = __importDefault(require("./helper/CreateUserHelper"));
const DoctorRepository_1 = __importDefault(require("../repository/DoctorRepository"));
const EditUserHelper_1 = __importDefault(require("./helper/EditUserHelper"));
const UserService_1 = __importDefault(require("./UserService"));
class DoctorService {
    constructor() {
        this.doctorRepository = new DoctorRepository_1.default();
        this.userService = new UserService_1.default();
        this.createUserHelper = new CreateUserHelper_1.default();
        this.editUserHelper = new EditUserHelper_1.default();
    }
    emailIsExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doctorRepository.emailIsExist(email);
        });
    }
    addDoctor(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.emailIsExist(request.email);
                request.password = yield this.userService.encryptPassword(request.password);
                const doctor = this.createUserHelper.createBaseUser(request);
                return yield this.doctorRepository.addDoctor((0, builder_pattern_1.Builder)(doctor).role(client_1.Role.DOCTOR).specialist(request.specialist).build());
            }
            catch (error) {
                throw error;
            }
        });
    }
    editDoctor(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = this.editUserHelper.editBaseUser(request);
                return yield this.doctorRepository.editDoctor((0, builder_pattern_1.Builder)(doctor).role(client_1.Role.DOCTOR).build());
            }
            catch (error) {
                console.error('Error editing doctor:', error);
                throw new Error('Failed to edit doctor');
            }
        });
    }
    getDoctorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.doctorRepository.getDoctorByEmail(email);
            }
            catch (error) {
                console.error('Error getting doctor by email:', error);
                throw new Error('Failed to get doctor');
            }
        });
    }
    getAllDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.doctorRepository.getAllDoctors();
            }
            catch (error) {
                console.error('Error getting all doctor:', error);
                throw new Error('Failed to get doctor');
            }
        });
    }
    getDoctorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.doctorRepository.getDoctorById(id);
            }
            catch (error) {
                console.error('Error getting doctor by id:', error);
                throw new Error('Failed to get doctor');
            }
        });
    }
    getDoctorByNik(nik) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.doctorRepository.getDoctorByNik(nik);
            }
            catch (error) {
                console.error('Error getting doctor by nik:', error);
                throw new Error('Failed to get doctor');
            }
        });
    }
}
exports.default = DoctorService;
