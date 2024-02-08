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

export type CreateContextType = {
	token: string;
	name: string;
	default?: boolean;
	context: string;
};

export type UpdateContextType = {
	id: string;
	data: Prisma.ContextUpdateInput;
};

export type DeleteContextType = {
	id: string;
};

export type FindContextType = {
	id?: string;
	name?: string;
};

export type SelectContextType = {
	context_id?: string | null;
	token: string;
};

export type GenerateChatType = {
	prompt: string;
	contextId?: string;
	token: string;
};
