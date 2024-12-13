import MedicineService from "../service/MedicineService";
import {Request, Response} from "express";
import MedicineDropdownVO from "../model/VOs/MedicineDropdownVO"
import BaseResponse from "../model/response/BaseResponse";
import PaginationRequest from "../model/request/PaginationRequest";
import BaseController from "./BaseController";
import { Medicine} from "@prisma/client";
import AddMedicineRequest from "../model/request/AddMedicineRequest";
import EditMedicineRequest from "../model/request/EditMedicineRequest";
import MedicineCheckStockVO from "../model/VOs/MedicineCheckStockVO";
import MedicineDisplayVO from "../model/VOs/MedicineDisplayVO";
import CheckExpirationRequest from "../model/request/CheckExpirationRequest";

export default class MedicineController extends BaseController {
    private readonly medicineService: MedicineService;

    constructor() {
        super();
        this.medicineService = new MedicineService();
    }

    async getMedicineList(req: Request, res: Response){
        try{
            console.log("#getMedicineDropdownOption with req ", req.query.isActive as string)
            const isActive = (req.query.isActive as string).toLowerCase() === "true" ? true : undefined
            const medicineDropdownOption: Map<string, MedicineDropdownVO> = await this.medicineService.getAllMedicineList(isActive)
            res.status(200).send(new BaseResponse().ok(Object.fromEntries(medicineDropdownOption)));
        } catch (error) {
            console.error("Error when #getMedicineDropdownOption with error:", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getMedicineListById(req: Request, res: Response){
        try{
            console.log("#getMedicineDropdownOption")
            const medicineDropdownOption: Map<number, MedicineDropdownVO> = await this.medicineService.getAllMedicineListById()
            res.status(200).send(new BaseResponse().ok(Object.fromEntries(medicineDropdownOption)));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    async getSingleMedicineById(req: Request, res: Response){
        try{
            console.log("#getMedicineDropdownOption")
            const request = parseInt(req.params.id)
            const medicine = await this.medicineService.getSingleMedicineById(request)
            res.status(200).send(new BaseResponse().ok(medicine));
        } catch (error) {
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
    
    public async getMedicines(req: Request, res: Response) {
        try {
            const parameter: string = req.query.parameter as string;
            const totalMedicine: number = parameter
                ? await this.medicineService.getTotalSearchMedicines(parameter)
                : await this.medicineService.getTotalMedicines();

            const pagination: PaginationRequest = this.getPagination(totalMedicine, req);
            const medicines: MedicineDisplayVO[] = parameter
                ? await this.medicineService.searchMedicines(pagination.startIndex, pagination.limit, parameter)
                : await this.medicineService.getAllMedicines(pagination.startIndex, pagination.limit);

            pagination.results = medicines;
            pagination.total = totalMedicine;
            return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination), "Succeed fetch medicines"));
        } catch (error) {
            console.log("[src][controller][MedicineController][getMedicines] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async getTotalMedicine(req: Request, res: Response) {
        try {
            const total: number = await this.medicineService.getTotalActiveMedicineByCode();
            return res.status(200).send(new BaseResponse().ok(total, "Succeed get total medicine"));
        } catch (error) {
            console.log("[src][controller][MedicineController][getTotalMedicine] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }
    
    public async getTotalNeedToRestock(req: Request, res: Response) {
        try {
            const total: number = await this.medicineService.getTotalNeedToRestock();
            return res.status(200).send(new BaseResponse().ok(total, "Succeed get total medicine need to restock"));
        } catch (error) {
            console.log("[src][controller][MedicineController][getTotalNeedToRestock] ", error);
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            return res.status(400).send(new BaseResponse().badRequest(errorMessage));
        }
    }

    public async createMedicine(req: Request, res: Response) {
        try {
            const request: AddMedicineRequest = req.body;
            const medicine: MedicineDisplayVO = await this.medicineService.createMedicine(request);
            return res.status(200).send(new BaseResponse().ok(null, "Succeed Created Medicine"));
        } catch (error) {
            console.log("[src][controller][MedicineController][createMedicine] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async editMedicine(req: Request, res: Response) {
        try {
            const request: EditMedicineRequest = req.body;
            const success = await this.medicineService.editMedicine(request);
            return res.status(200).send(new BaseResponse().ok(success, "Succeed Edited Medicine"));
        } catch (error) {
            console.log("[src][controller][MedicineController][editMedicine] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    // public async addStock(req: Request, res: Response) {
    //     try {
    //         const request: EditMedicineRequest = req.body;
    //         await this.medicineService.addStock(request.id, request.currStock);
    //         return res.status(200).send(new BaseResponse().ok(null, "Succeed Addedd Stock"));
    //     } catch (error) {
    //         console.log("[src][controller][MedicineController][addStock] ", error);
    //         const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
    //         return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
    //     }
    // }

    public async checkStock(req: Request, res: Response) {
        try {
            const request: EditMedicineRequest = req.body;
            const result: MedicineCheckStockVO = await this.medicineService.checkStock(request.id);
            return result.flag == 1 
                ? res.status(200).send(new BaseResponse().ok("Stock is ok"))
                : res.status(200).send(new BaseResponse().ok("Medicine should be restocked"));
        } catch (error) {
            console.log("[src][controller][MedicineController][checkStock] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    // public async deleteMedicine(req: Request, res: Response) {
    //     try {
    //         const request: EditMedicineRequest = req.body;
    //         const medicine: MedicineDisplayVO = await this.medicineService.deleteMedicine(request.id);
    //         return res.status(200).send(new BaseResponse().ok(medicine, "Succeed Deleted Medicine"));
    //     } catch (error) {
    //         console.log("[src][controller][MedicineController][deleteMedicine] ", error);
    //         const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
    //         return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
    //     }
    // }

    public async checkExpiration(req: Request, res: Response) {
        try {
            const request: CheckExpirationRequest = req.body;
            const medicine: Medicine[] = await this.medicineService.checkExpiration(request.expiredDate);
            return res.status(200).send(new BaseResponse().ok(medicine, "Succeed Checked Expiration"));
        } catch (error) {
            console.log("[src][controller][MedicineController][checkExpiration] ", error);
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async getMedicineByCodeSummary(req: Request, res: Response) {
        try {
            console.log("#getMedicineSumaryByCode with request: ", req.query)
            const searchQuery = req.query.search as string | undefined
            const sortBy = req.query.sortBy as string | undefined
            const sortMode = req.query.sortMode as string | undefined
            const totalData = await this.medicineService.getTotalSearchMedicineByCode(searchQuery)
            const pagination = this.getPagination(totalData, req)
            pagination.results = await this.medicineService.getMedicineSummaryByCode(pagination.startIndex, pagination.limit, searchQuery,
                sortBy, sortMode)
            pagination.total = totalData
            res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)))
        } catch (error) {
            console.error("Error when #getMedicineByCodeSummary with error: ", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }

    public async getMedicineByIdSummary(req: Request, res: Response) {
        try {
            console.log("#getMedicineSumaryById with request: ", req.query)
            const searchQuery = req.query.search as string | undefined
            const sortBy = req.query.sortBy as string | undefined
            const sortMode = req.query.sortMode as string | undefined
            const totalData = await this.medicineService.getTotalSearchMedicines(searchQuery)
            const pagination = this.getPagination(totalData, req)
            pagination.results = await this.medicineService.getMedicineSummaryById(pagination.startIndex, pagination.limit, searchQuery,
                sortBy, sortMode)
            pagination.total = totalData
            res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)))
        } catch (error) {
            console.error("Error when #getMedicineByIdSummary with error: ", error)
            const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
            return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
        }
    }
}
