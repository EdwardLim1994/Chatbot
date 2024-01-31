import type {
	AuthenticationTokenType,
	AuthenticationType,
	LogoutUserType,
} from "../libs/types";

import { generateToken, validatePassword } from "../libs/helpers";
import Account from "./Account";
import { isEmpty } from "lodash";

class Authentication {
	private accountService: Account = new Account();

	public async authenticate(payload: AuthenticationTokenType) {
		const found = await this.accountService.findSingleAccount({
			token: payload.token,
		});

		return isEmpty(found) ? false : true;
	}

	public async login(payload: AuthenticationType) {
		const user = await this.accountService.findSingleAccount({
			username: payload.username,
			selectFields: {
				id: true,
				password: true,
			},
		});

		if (!user) throw new Error("User not found");

		if (!validatePassword(user?.password, payload.password))
			throw new Error("Password not match");

		const token = await generateToken(
			payload.username,
			user?.password,
			payload.jwtNamespace
		);

		return await this.accountService.updateAccount({
			id: user.id,
			data: {
				token,
			},
		});
	}

	public async logout(payload: LogoutUserType) {
		return await this.accountService.updateAccount({
			id: payload.id,
			data: {
				token: null,
			},
		});
	}
}

export default Authentication;
