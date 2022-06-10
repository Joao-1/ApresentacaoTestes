import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "@prisma/client";
import PrismaService from "../../../..//providers/prisma/prisma.service";
import UserRepository from "../../user.repository";
import { UserService } from "../../user.service";
import createUser from "../__mocks__/createUserToTest";

describe("UserService", () => {
	let app: INestApplication;
	let service: UserService;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleFixture = await Test.createTestingModule({
			providers: [UserService, UserRepository, PrismaService],
		}).compile();

		service = moduleFixture.get<UserService>(UserService);
		prisma = moduleFixture.get<PrismaService>(PrismaService);
		app = moduleFixture.createNestApplication();

		await app.init();
	});

	afterAll(async () => {
		await prisma.user.deleteMany();
	});

	it("deve retornar um novo usuário", async () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...data } = await createUser();
		const newUser = await service.create(data);
		expect(newUser).toHaveProperty("id");
		expect(newUser).toMatchObject<User>(newUser);
	});
});
