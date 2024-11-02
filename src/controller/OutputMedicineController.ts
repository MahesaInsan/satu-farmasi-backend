import OutputMedicineService from "../service/OutputMedicineService";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import { Request, Response } from "express";
import PaginationRequest from "../model/request/PaginationRequest";

export default class OutputMedicineController extends BaseController {
	private readonly outputMedicineService: OutputMedicineService;

	constructor() {
		super();
		this.outputMedicineService = new OutputMedicineService();
	}

	public async getAllOutputMedicines(req: Request, res: Response) {
		try {
			const { q, filter }: { q?: string, filter?: string } = req.query as { q?: string, filter?: string };
			const totalData: number = (q || filter)
				? await this.outputMedicineService.getTotalOutputMedicineBySearch(q, filter)
				: await this.outputMedicineService.getTotalOutputMedicines() ?? 0;

			const pagination: PaginationRequest = this.getPagination(totalData, req);

			const outputMedicines = (q || filter)
				? await this.outputMedicineService.getOutputMedicineBySearch(pagination.limit, pagination.startIndex, q, filter)
				: await this.outputMedicineService.getAllOutputMedicines(pagination.limit, pagination.startIndex);

			pagination.results = outputMedicines;
			pagination.total = totalData;

			return res.status(200).send(new BaseResponse().ok(this.responseHelper.constructPaginationResponse(pagination)));
		} catch (error) {
			const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
			return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
		}
	}

	public async getOutputMedicineById(req: Request, res: Response) {
		try {
			const outputMedicine = await this.outputMedicineService.getOutputMedicineById(Number(req.params.id));
			return res.status(200).send(new BaseResponse().ok(outputMedicine));
		} catch (error) {
			res.status(400).send(this.responseHelper.constructBadRequest(error as object))
		}
	}

	public async createOutputMedicine(req: Request, res: Response) {
		try {
			// TODO: add validation
			await this.outputMedicineService.addOutputMedicine(req.body);
			return res.status(200).send(new BaseResponse().ok(null, "Succeed Created Output Medicine"));
		} catch (error) {
			console.log("[src][controller][MedicineController][createMedicine] ", error);
			const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
			return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
		}
	}

	public async editOutputMedicine(req: Request, res: Response) {
		try {
			await this.outputMedicineService.editOutputMedicine(req.body);
			return res.status(200).send(new BaseResponse().ok(null, "Succeed Edited Output Medicine"));
		} catch (error) {
			console.log("[src][controller][MedicineController][createMedicine] ", error);
			const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
			return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
		}
	}

	public async deleteOutputMedicine(req: Request, res: Response) {
		try {
			await this.outputMedicineService.deleteOutputMedicine(req.body);
			return res.status(200).send(new BaseResponse().ok(null, "Succeed Deleted Output Medicine"));
		} catch (error) {
			console.log("[src][controller][MedicineController][createMedicine] ", error);
			const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
			return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
		}
	}
}
