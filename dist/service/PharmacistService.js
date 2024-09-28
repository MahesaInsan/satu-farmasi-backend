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
const UserService_1 = __importDefault(require("./UserService"));
const PharmacistRepository_1 = __importDefault(require("../repository/PharmacistRepository"));
const EditUserHelper_1 = __importDefault(require("./helper/EditUserHelper"));
class PharmacistService {
    constructor() {
        this.pharmacistRepository = new PharmacistRepository_1.default();
        this.userService = new UserService_1.default();
        this.createUserHelper = new CreateUserHelper_1.default();
        this.editUserHelper = new EditUserHelper_1.default();
    }
    emailIsExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pharmacistRepository.emailIsExist(email);
        });
    }
    addPharmacist(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.emailIsExist(request.email);
                request.password = yield this.userService.encryptPassword(request.password);
                const pharmacist = this.createUserHelper.createBaseUser(request);
                return yield this.pharmacistRepository.addPharmacist((0, builder_pattern_1.Builder)(pharmacist).role(client_1.Role.PHARMACIST).build());
            }
            catch (error) {
                throw error;
            }
        });
    }
    editPharmacist(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pharmacist = this.editUserHelper.editBaseUser(request);
                return yield this.pharmacistRepository.editPharmacist((0, builder_pattern_1.Builder)(pharmacist).role(client_1.Role.PHARMACIST).build());
            }
            catch (error) {
                console.error('Error updating pharmacist:', error);
                throw new Error('Failed to update pharmacist');
            }
        });
    }
    getPharmacistByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.pharmacistRepository.getPharmacistByEmail(email);
            }
            catch (error) {
                console.error('Error getting pharmacist by email:', error);
                throw new Error('Failed to get pharmacist');
            }
        });
    }
    getAllPharmacists() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.pharmacistRepository.getAllPharmacists();
            }
            catch (error) {
                console.error('Error getting all pharmacist:', error);
                throw new Error('Failed to get pharmacist');
            }
        });
    }
    getPharmacistById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.pharmacistRepository.getPharmacistById(id);
            }
            catch (error) {
                console.error('Error getting pharmacist by id:', error);
                throw new Error('Failed to get pharmacist');
            }
        });
    }
    getPharmacistByNik(nik) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.pharmacistRepository.getPharmacistByNik(nik);
            }
            catch (error) {
                console.error('Error getting pharmacist by nik:', error);
                throw new Error('Failed to get pharmacist');
            }
        });
    }
}
exports.default = PharmacistService;
