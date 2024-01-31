import { Prisma } from "@prisma/client";
import { STATUS } from "./enum";

export type ReturnResult = {
	status: STATUS;
	body: any;
};

export type LogoutUserType = {
	id: string;
};

export type FindUserType = {
	username?: string;
	id?: string;
	token?: string;
	selectFields?: Prisma.UserSelect;
};

export type CreateUserType = {
	username: string;
	keyword: string;
	password: string;
};

export type UpdateUserType = {
	id: string;
	data: Prisma.UserUpdateInput;
};

export type DeleteUserType = {
	id: string;
};

export type AuthenticationType = {
	username: string;
	password: string;
	jwtNamespace: any;
};

export type AuthenticationTokenType = {
	token: string;
};
