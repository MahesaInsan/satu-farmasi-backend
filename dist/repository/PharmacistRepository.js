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
const BaseRepository_1 = __importDefault(require("./helper/BaseRepository"));
// import Pharmacist from "../entity/Pharmacist"
class PharmacistRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    emailIsExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.Prisma.pharmacist.findUnique({ where: { email: email } });
                return admin !== null;
            }
            catch (error) {
                console.error('Error checking email:', error);
                throw new Error('Failed to check email');
            }
        });
    }
    addPharmacist(pharmacist) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(pharmacist);
                return yield this.Prisma.pharmacist.create({ data: pharmacist });
            }
            catch (error) {
                console.error('Error adding admin:', error);
                throw new Error('Failed to add admin');
            }
        });
    }
    getPharmacistByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.pharmacist.findUnique({ where: { email: email } });
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
                return this.Prisma.pharmacist.findMany();
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
                return this.Prisma.pharmacist.findUnique({ where: { id: id } });
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
                return this.Prisma.pharmacist.findFirst({ where: { nik: nik } });
            }
            catch (error) {
                console.error('Error getting pharmacist by nik:', error);
                throw new Error('Failed to get pharmacist');
            }
        });
    }
    editPharmacist(pharmacist) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.Prisma.pharmacist.update({ where: { nik: pharmacist.nik }, data: pharmacist });
            }
            catch (error) {
                console.error('Error updating pharmacist:', error);
                throw new Error('Failed to update pharmacist');
            }
        });
    }
}
exports.default = PharmacistRepository;
