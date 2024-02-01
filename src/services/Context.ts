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

class Context {
	private prisma: PrismaClient = Prisma.instance();
	private accountService: Account = new Account();

	public async createContext(payload: CreateContextType) {
		return await this.prisma.context.create({ data: payload });
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
		return this.accountService.updateAccount({
			id: payload.user_id,
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
