import { ReturnResult } from "./types";
import { STATUS } from "./enum";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { isEmpty } from "lodash";

export const buildSuccessResult = (body: any): ReturnResult => ({
	status: STATUS.Success,
	body,
});

export const buildFailedResult = (body: any): ReturnResult => ({
	status: STATUS.Failed,
	body,
});

export const generateToken = async (
	name: string,
	keyword: string,
	namespace: any
) => {
	return await namespace.sign(`${name}-${keyword}`);
};

export const encryptPassword = (password: string) => {
	const salt = randomBytes(16).toString("base64");
	const hashPassword = scryptSync(password, salt, 64).toString("base64");

	return `${salt}.${hashPassword}`;
};

export const validatePassword = (base: string, incoming: string) => {
	const [salt, key] = base.split(".");
	const keyBuffer = Buffer.from(key, "base64");
	const hashedBuffer = scryptSync(incoming, salt, 64);

	return timingSafeEqual(hashedBuffer, keyBuffer);
};

export const checkAuthTokenExistInHeader = (ctx: any) => {
	return !isEmpty(ctx?.headers["x-auth-token"]);
};
