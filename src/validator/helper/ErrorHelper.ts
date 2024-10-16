import { Prisma } from "@prisma/client";

export class CustomError extends Error {
	details?: {
		[key: string]: {
			type: string;
			msg: string;
			path: string;
			location: string;
		}
	};

	constructor(message?: string, details?: CustomError['details']) {
		super(message);
		this.details = details;
	}

	public formatError(message: string, field: string): CustomError {
		const detail = {
			[field]: {
				"type": "field",
				"msg": message,
				"path": field,
				"location": "body"
			},
		}
		return new CustomError(message, detail);
	}

	public handlePrismaError(error: any, defaultMessage: string): void {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const errorsList = [
				{
					code: 'P2002',
					label: 'Uniques value',
					message: `${error.meta?.target} already exist`
				}
			]
			errorsList.forEach(err => {
				throw err.code === error.code && this.formatError(err.message, error.meta?.target as string);
			});
		}
		throw new Error(defaultMessage);
	}
}
