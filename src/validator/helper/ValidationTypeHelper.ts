export type ValidationSchema = {
	[key: string]: { [rule: string]: any };
};
export type ValidationMethod = (validator: any, value?: any) => any;
