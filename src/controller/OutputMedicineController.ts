import OutputMedicineService from "../service/OutputMedicineService";
import BaseResponse from "../model/response/BaseResponse";
import BaseController from "./BaseController";
import { Request, Response } from "express";
import PaginationRequest from "../model/request/PaginationRequest";
import BulkAddOutputMedicineRequest from "../model/request/BulkAddOutputMedicineRequest";

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
			await this.outputMedicineService.addOutputMedicine(req.body);
			return res.status(200).send(new BaseResponse().ok(null, "Obat Keluar Berhasil Dibuat"));
		} catch (error) {
			console.log("[src][controller][MedicineController][createMedicine] ", error);
			const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
			return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
		}
	}

	public async bulkCreateOutputMedicine(req: Request, res: Response) {
		try {
			console.log("#bulkCreateOutputMedicine with request: ", req.body.data)
			const request: BulkAddOutputMedicineRequest = req.body.data
			await this.outputMedicineService.bulkAddOutputMedicine(request)
			return res.status(200).send(new BaseResponse().ok(null, "Succeed Created Bulk Output Medicine"));
		} catch (error) {
			console.log("Error when #bulkCreateOutputMedicine with error: ", error);
			const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
			return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
		}
	}

	public async editOutputMedicine(req: Request, res: Response) {
		try {
			await this.outputMedicineService.editOutputMedicine(req.body);
            console.log("req.body: ", req.body);
			return res.status(200).send(new BaseResponse().ok(null, "Obat Keluar Berhasil Diperbarui"));
		} catch (error) {
			console.log("[src][controller][MedicineController][createMedicine] ", error);
			const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
			return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
		}
	}

	public async deleteOutputMedicine(req: Request, res: Response) {
		try {
			await this.outputMedicineService.deleteOutputMedicine(req.body);
			return res.status(200).send(new BaseResponse().ok(null, "Obat Keluar Berhasil Dihapus"));
		} catch (error) {
			console.log("[src][controller][MedicineController][deleteOutputMedicine] ", error);
			const { defaultErrorMsg, errors } = new BaseResponse().constructErrorHandler(error as object);
			return res.status(400).send(new BaseResponse().badRequest(defaultErrorMsg, errors));
		}
	}
}
