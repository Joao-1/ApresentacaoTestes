import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../../../../app.module";
import PrismaService from "../../../../providers/prisma/prisma.service";
import createUser from "../__mocks__/createUserToTest";

describe("E2E testes", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		prisma = moduleFixture.get<PrismaService>(PrismaService);
		await app.init();
	});

	describe("UserController", () => {
		describe("Create", () => {
			it("/POST user", async () => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { id, ...data } = await createUser();

				const response = await request(app.getHttpServer()).post(`/user`).send(data);
				const createdUser = await prisma.user.findFirst({ where: { email: data.email } });

				expect(response.statusCode).toBe(201);
				expect(response.body.status).toBe("success");
				expect(response.body.newUser).toHaveProperty("id");
				expect(response.body.newUser).toStrictEqual(createdUser);
			});
		});
		describe("Read", () => {
			it(`/GET user`, async () => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { id, ...data } = await createUser();

				const user = await prisma.user.create({ data });

				const response = await request(app.getHttpServer()).get(`/user/${user.id}`);

				expect(response.statusCode).toBe(200);
				expect(response.body.status).toBe("success");
				expect(response.body.user[0]).toStrictEqual(user);
			});
		});
	});

	afterAll(async () => {
		await app.close();
		await prisma.user.deleteMany();
	});
});
