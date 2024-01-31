import { PrismaClient } from "@prisma/client";

class Prisma {
	static client: PrismaClient;
	private contructor() {}

	public static instance(): PrismaClient {
		if (!this.client) this.client = new PrismaClient();
		return this.client;
	}
}

export default Prisma;
