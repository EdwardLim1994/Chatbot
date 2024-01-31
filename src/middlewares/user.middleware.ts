import { checkAuthTokenExistInHeader } from "../libs/helpers";
import Account from "../services/Account";
import Authentication from "../services/Authentication";

const account = new Account();
const authentication = new Authentication();

function verifyJwtToken(ctx: any) {
	return (
		checkAuthTokenExistInHeader(ctx) &&
		ctx.jwt.verify(ctx.headers["x-auth-token"])
	);
}

export const if_user_token_valid = (ctx: any) => {
	if (!verifyJwtToken(ctx)) return (ctx.set.status = "Unauthorized");
};

export const if_user_login = async (ctx: any) => {
	if (!verifyJwtToken(ctx)) return (ctx.set.status = "Unauthorized");

	const valid = await authentication
		.authenticate({ token: ctx.headers["x-auth-token"] })
		.catch((err) => console.error(err));

	if (!valid) return (ctx.set.status = "Unauthorized");
};

export const if_user_exist = async (ctx: any) => {
	const payload = {
		username: ctx?.body?.username,
		id: ctx?.body?.id,
	};

	const user = await account
		.findAccount({
			...payload,
			selectFields: {
				id: true,
				username: true,
				context: true,
				createdAt: true,
			},
		})
		.catch((err) => console.error(err));

	if (!user) return (ctx.set.status = "Not Found");
};
