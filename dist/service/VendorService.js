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
const VendorRepository_1 = __importDefault(require("../repository/VendorRepository"));
const EditVendorHelper_1 = __importDefault(require("./helper/EditVendorHelper"));
class VendorService {
    constructor() {
        this.vendorRepository = new VendorRepository_1.default();
        this.vendorHelper = new EditVendorHelper_1.default();
    }
    getTotalVendor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.vendorRepository.getTotalVendors();
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getTotalVendorByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.vendorRepository.getTotalVendorsByName(name);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getAllVendor(limit, startIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.vendorRepository.getAllVendors(limit, startIndex);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getVendorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.vendorRepository.getVendorById(id);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getVendorByName(limit, startIndex, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.vendorRepository.getVendorByName(limit, startIndex, name);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    addVendor(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = this.vendorHelper.createVendor(request);
                return yield this.vendorRepository.addVendor(vendor);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    editVendor(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = this.vendorHelper.editVendor(request);
                return yield this.vendorRepository.editVendor(vendor);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    deleteVendor(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = this.vendorHelper.editVendor(request);
                return yield this.vendorRepository.editVendor(vendor);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = VendorService;
