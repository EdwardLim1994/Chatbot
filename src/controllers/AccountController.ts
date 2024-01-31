import {
	buildFailedResult,
	buildSuccessResult,
	encryptPassword,
} from "../libs/helpers";
import Account from "../services/Account";

const account = new Account();

export const findAccount = async (ctx: any) => {
	return account
		.findAccount({
			username: ctx?.query.username,
			id: ctx?.query.id,
			selectFields: {
				id: true,
				username: true,
				context: true,
				createdAt: true,
			},
		})
		.then((res) => buildSuccessResult({ user: res }))
		.catch((err) => buildFailedResult(err));
};

export const createAccount = async (ctx: any) => {
	return account
		.createAccount({
			username: ctx.body.name,
			keyword: ctx.body.keyword,
			password: encryptPassword(ctx.body.password),
		})
		.then((res) => buildSuccessResult({ user: res }))
		.catch((err) => buildFailedResult(err));
};

export const deleteAccount = async (ctx: any) => {
	return account
		.deleteAccount({ id: ctx.body.id })
		.then((res) => buildSuccessResult(res))
		.catch((err) => buildFailedResult(err));
};

export const refreshToken = async (ctx: any) => {
	return account
		.refreshToken(ctx.body.id, ctx.jwt)
		.then((res) => buildSuccessResult({ token: res }))
		.catch((err) => buildFailedResult(err));
};
