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
const AdminService_1 = __importDefault(require("../service/AdminService"));
const ResponseHelper_1 = __importDefault(require("./ResponseHelper/ResponseHelper"));
const BaseResponse_1 = __importDefault(require("../model/response/BaseResponse"));
class AdminController {
    constructor() {
        this.adminService = new AdminService_1.default();
        this.responseHelper = new ResponseHelper_1.default();
    }
    addAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const createdAdmin = yield this.adminService.addAdmin(request);
                res.status(200).send(this.responseHelper.constructAddAdminResponse(createdAdmin));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    getAllAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminList = yield this.adminService.getAllAdmin();
                res.status(200).send(adminList);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    showAllAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send("HELLO WORLD");
        });
    }
    getAllStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staffList = yield this.adminService.getAllStaff();
                return res.status(200).send(this.responseHelper.constructGetStaffResponse(staffList));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    getStaffById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const staff = yield this.adminService.getStaffById(id);
                // return res.status(200).send(this.responseHelper.constructGetStaffResponse(staff));
                return res.status(200).send(new BaseResponse_1.default().ok(staff));
            }
            catch (error) {
                return res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    getStaffByNik(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const staff = yield this.adminService.getStaffByNik(body.nik);
                return res.status(200).send(new BaseResponse_1.default().ok(staff));
            }
            catch (error) {
                return res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    editStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const editedStaff = yield this.adminService.editStaff(request);
                return res.status(200).send(this.responseHelper.constructEditStaffResponse(editedStaff));
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
}
exports.default = AdminController;
