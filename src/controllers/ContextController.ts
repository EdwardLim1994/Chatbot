import { buildFailedResult, buildSuccessResult } from "../libs/helpers";
import Context from "../services/Context";

const context = new Context();

export const createContext = async (ctx: any) => {
	return context
		.createContext({
			name: ctx.body.name,
			context: ctx.body.context,
			token: ctx.headers["x-auth-token"],
		})
		.then((res) => buildSuccessResult(res))
		.catch((err) => buildFailedResult(err));
};

export const findContexts = async (ctx: any) => {
	return context
		.findContext({
			id: ctx.body?.id,
			name: ctx.body?.name,
		})
		.then((res) => buildSuccessResult(res))
		.catch((err) => buildFailedResult(err));
};

export const deleteContext = async (ctx: any) => {
	return context
		.deleteContext({
			id: ctx.body.id,
		})
		.then((res) => buildSuccessResult(res))
		.catch((err) => buildFailedResult(err));
};

export const updateContext = async (ctx: any) => {
	return context
		.updateContext({
			id: ctx.body.id,
			data: ctx.body.data,
		})
		.then((res) => buildSuccessResult(res))
		.catch((err) => buildFailedResult(err));
};

export const selectContext = async (ctx: any) => {
	return context
		.selectContext({
			token: ctx.headers["x-auth-token"],
			context_id: ctx.body.context_id,
		})
		.then((res) => buildSuccessResult(res))
		.catch((err) => buildFailedResult(err));
};
export const deselectContext = async (ctx: any) => {
	return context
		.selectContext({
			token: ctx.headers["x-auth-token"],
			context_id: null,
		})
		.then((res) => buildSuccessResult(res))
		.catch((err) => buildFailedResult(err));
};
