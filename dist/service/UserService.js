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
const DoctorRepository_1 = __importDefault(require("../repository/DoctorRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PharmacistRepository_1 = __importDefault(require("../repository/PharmacistRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.adminRepository = new AdminRepository_1.default();
        this.doctorRepository = new DoctorRepository_1.default();
        this.pharmacistRepository = new PharmacistRepository_1.default();
    }
    generateToken(email, role) {
        const secretToken = process.env["SECRET_TOKEN"];
        if (!secretToken)
            throw new Error("SECRET_TOKEN environment variable is not set");
        return jsonwebtoken_1.default.sign({ email, role }, secretToken, { expiresIn: '1800s' });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.adminRepository.getAdminByEmail(email)) ||
                (yield this.doctorRepository.getDoctorByEmail(email)) ||
                (yield this.pharmacistRepository.getPharmacistByEmail(email));
        });
    }
    emailIsExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = (yield this.adminRepository.emailIsExist(email)) ||
                (yield this.doctorRepository.emailIsExist(email)) ||
                (yield this.pharmacistRepository.emailIsExist(email));
            if (isExist)
                throw new Error("Email is already exist");
        });
    }
    encryptPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
    bcryptPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hash);
        });
    }
}
exports.default = UserService;
