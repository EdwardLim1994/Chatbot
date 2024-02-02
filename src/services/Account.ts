import { PrismaClient } from "@prisma/client";
import type {
	CreateUserType,
	DeleteUserType,
	FindUserType,
	UpdateUserType,
} from "../libs/types";

import Prisma from "./Prisma";
import { generateToken } from "../libs/helpers";

class Account {
	private prisma: PrismaClient;

	public constructor() {
		this.prisma = Prisma.instance();
	}

	public async findSingleAccount(payload: FindUserType) {
		return await this.prisma.user.findFirst({
			where: {
				username: payload?.username,
				id: payload?.id,
				token: payload?.token,
			},
			select: payload.selectFields,
		});
	}

	public async findAccount(payload: FindUserType) {
		return await this.prisma.user.findMany({
			where: {
				id: payload?.id,
				username: payload?.username,
			},
			select: payload.selectFields,
		});
	}

	public async createAccount(payload: CreateUserType) {
		const user = await this.prisma.user.create({
			data: payload,
		});

		return Object.fromEntries(
			Object.entries(user).filter(([key]) =>
				["id", "username"].includes(key)
			)
		);
	}

	public async updateAccount(payload: UpdateUserType) {
		const user = await this.prisma.user.update({
			where: {
				id: payload.id,
			},
			data: payload.data,
		});

		return Object.fromEntries(
			Object.entries(user).filter(([key]) =>
				["id", "username", "token"].includes(key)
			)
		);
	}

	public async deleteAccount(payload: DeleteUserType) {
		return await this.prisma.user.delete({
			where: {
				id: payload.id,
			},
		});
	}

	public async refreshToken(id: string, namespace: any) {
		const user = await this.prisma.user.findFirst({
			where: {
				id,
			},
		});

		if (!user) throw new Error("User not found");
		return await generateToken(user.username, user.keyword, namespace);
	}
}

export default Account;
