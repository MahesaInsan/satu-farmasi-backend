"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const AdminRouter_1 = __importDefault(require("../router/AdminRouter"));
const DoctorRouter_1 = __importDefault(require("../router/DoctorRouter"));
const PharmacistRouter_1 = __importDefault(require("../router/PharmacistRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const UserRouter_1 = __importDefault(require("../router/UserRouter"));
const MedicineRouter_1 = __importDefault(require("../router/MedicineRouter"));
const PatientRouter_1 = __importDefault(require("../router/PatientRouter"));
const DiagnoseRouter_1 = __importDefault(require("../router/DiagnoseRouter"));
const PrescriptionRouter_1 = __importDefault(require("../router/PrescriptionRouter"));
const PackagingRouter_1 = __importDefault(require("../router/PackagingRouter"));
const GenericNameRoute_1 = __importDefault(require("../router/GenericNameRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const VendorRouter_1 = __importDefault(require("../router/VendorRouter"));
const ClassificationRouter_1 = __importDefault(require("../router/ClassificationRouter"));
class App {
    constructor() {
        this.corsOptions = {
            origin: "http://localhost:3000",
            credentials: true,
            methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
        };
        dotenv_1.default.config();
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || "8000");
        this.initConfig();
        this.initRouter();
    }
    initConfig() {
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)(this.corsOptions));
        this.app.options("*", (0, cors_1.default)(this.corsOptions)); // Preflight OPTIONS request
    }
    initRouter() {
        this.app.use("/api/v1/admins", AdminRouter_1.default);
        this.app.use("/api/v1/doctors", DoctorRouter_1.default);
        this.app.use("/api/v1/pharmacists", PharmacistRouter_1.default);
        this.app.use("/api/v1/users", UserRouter_1.default);
        this.app.use("/api/v1/medicines", MedicineRouter_1.default);
        this.app.use("/api/v1/patients", PatientRouter_1.default);
        this.app.use("/api/v1/diagnose", DiagnoseRouter_1.default);
        this.app.use("/api/v1/packagings", PackagingRouter_1.default);
        this.app.use("/api/v1/genericName", GenericNameRoute_1.default);
        this.app.use("/api/v1/prescriptions", PrescriptionRouter_1.default);
        this.app.use("/api/v1/vendors", VendorRouter_1.default);
        this.app.use("/api/v1/classifications", ClassificationRouter_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
