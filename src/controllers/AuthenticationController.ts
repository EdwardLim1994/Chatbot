import { buildFailedResult, buildSuccessResult } from "../libs/helpers";
import Authentication from "../services/Authentication";

const authentication = new Authentication();

export const login = async (ctx: any) => {
	return authentication
		.login({
			username: ctx.body.username,
			password: ctx.body.password,
			jwtNamespace: ctx.jwt,
		})
		.then((res) => buildSuccessResult({ token: res }))
		.catch((err) => buildFailedResult(err));
};
export const logout = async (ctx: any) => {
	return authentication
		.logout({
			id: ctx.body.id,
		})
		.then((res) => buildSuccessResult({ result: res }))
		.catch((err) => buildFailedResult(err));
};
