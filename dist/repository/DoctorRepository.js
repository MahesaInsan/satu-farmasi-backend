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
// import Doctor from "../entity/Doctor";
class DoctorRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    emailIsExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctor = yield this.Prisma.doctor.findUnique({ where: { email: email } });
                return doctor !== null;
            }
            catch (error) {
                console.error('Error checking email:', error);
                throw new Error('Failed to check email');
            }
        });
    }
    addDoctor(doctor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.doctor.create({ data: doctor });
            }
            catch (error) {
                console.error('Error adding admin:', error);
                throw new Error('Failed to add admin');
            }
        });
    }
    getDoctorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.doctor.findUnique({ where: { email: email } });
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
                return yield this.Prisma.doctor.findMany();
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
                return yield this.Prisma.doctor.findUnique({ where: { id: id } });
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
                return yield this.Prisma.doctor.findUnique({ where: { nik: nik } });
            }
            catch (error) {
                console.error('Error getting doctor by nik:', error);
                throw new Error('Failed to get doctor');
            }
        });
    }
    editDoctor(doctor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.Prisma.doctor.update({ where: { nik: doctor.nik }, data: doctor });
            }
            catch (error) {
                console.error('Error editing doctor:', error);
                throw new Error('Failed to edit doctor');
            }
        });
    }
}
exports.default = DoctorRepository;
