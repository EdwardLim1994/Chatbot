import { PrismaClient } from "@prisma/client";
import Prisma from "./Prisma";
import Account from "./Account";
import {
	CreateContextType,
	DeleteContextType,
	FindContextType,
	SelectContextType,
	UpdateContextType,
} from "../libs/types";
import { isEmpty } from "lodash";

class Context {
	private prisma: PrismaClient = Prisma.instance();
	private accountService: Account = new Account();

	public async createContext(payload: CreateContextType) {
		const user = await this.accountService.findSingleAccount({
			token: payload.token,
		});

		if (isEmpty(user)) throw new Error("User not found");

		return await this.prisma.context.create({
			data: {
				name: payload.name,
				context: payload.context,
				user_id: user.id,
			},
		});
	}

	public async updateContext(payload: UpdateContextType) {
		return await this.prisma.context.update({
			where: {
				id: payload.id,
			},
			data: payload.data,
		});
	}
	public async deleteContext(payload: DeleteContextType) {
		const context = await this.prisma.context.delete({
			where: {
				id: payload.id,
			},
		});

		await this.accountService.updateAccount({
			id: context.user_id,
			data: {
				selectedContext: null,
			},
		});

		return context;
	}
	public async selectContext(payload: SelectContextType) {
		const user = await this.accountService.findSingleAccount({
			token: payload.token,
		});

		if (isEmpty(user)) throw new Error("User not found");

		return this.accountService.updateAccount({
			id: user.id,
			data: {
				selectedContext: payload.context_id,
			},
		});
	}
	public async findContext(payload: FindContextType) {
		return await this.prisma.context.findMany({
			where: {
				id: payload.id,
				name: payload.name,
			},
		});
	}
}

export default Context;
