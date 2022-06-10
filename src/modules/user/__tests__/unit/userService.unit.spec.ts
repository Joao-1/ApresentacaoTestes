import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import createUser from "../__mocks__/createUserToTest";
import UserRepository from "../../user.repository";
import { UserService } from "../../user.service";
import PrismaService from "../../../../providers/prisma/prisma.service";
import { sendEmail } from "../../../../helpers/sendMail";

jest.mock(`../../../../providers/prisma/prisma.service.ts`);
jest.mock("../../../../helpers/sendMail", () => {
	return {
		sendEmail: jest.fn(),
	};
});

describe("UserService", () => {
	let app: INestApplication;
	let service: UserService;
	let repository: UserRepository;

	beforeAll(async () => {
		const moduleFixture = await Test.createTestingModule({
			providers: [UserService, UserRepository, PrismaService],
		}).compile();

		service = moduleFixture.get<UserService>(UserService);
		repository = moduleFixture.get<UserRepository>(UserRepository);
		app = moduleFixture.createNestApplication();

		await app.init();
	});

	describe("Criar usuário", () => {
		it("deve retornar um novo usuário", async () => {
			const mockRepository = jest.spyOn(repository, "find");
			const user = await createUser();
			mockRepository
				.mockReturnValueOnce(Promise.resolve([]))
				.mockReturnValueOnce(Promise.resolve([]))
				.mockReturnValueOnce(Promise.resolve([]));

			jest.spyOn(repository, "insert").mockReturnValue(Promise.resolve(user));

			const newUser = await service.create(user);

			expect(newUser).toStrictEqual(user);
			expect(mockRepository).toHaveBeenCalledTimes(3);
			expect(mockRepository.mock.calls).toEqual([
				[{ where: { email: user.email } }],
				[{ where: { cpf: user.cpf } }],
				[{ where: { phone: user.phone } }],
			]);
			expect(sendEmail).toHaveBeenCalled();
		});

		it("deve retornar um erro dizendo que o email já foi cadastrado", async () => {
			const user = await createUser();
			jest.spyOn(repository, "find").mockReturnValue(Promise.resolve([user]));

			try {
				await service.create(user);
			} catch (error) {
				expect(error.message).toBe("Email já registrado no sistema");
			}
		});

		it("deve retornar um erro dizendo que o cpf já foi cadastrado", async () => {
			const user = await createUser();
			jest.spyOn(repository, "find")
				.mockResolvedValueOnce(Promise.resolve([]))
				.mockReturnValueOnce(Promise.resolve([user]));

			try {
				await service.create(user);
			} catch (error) {
				expect(error.message).toBe("CPF já registrado no sistema");
			}
		});

		it("deve retornar um erro dizendo que o telefone já foi cadastrado", async () => {
			const user = await createUser();
			jest.spyOn(repository, "find")
				.mockResolvedValueOnce(Promise.resolve([]))
				.mockResolvedValueOnce(Promise.resolve([]))
				.mockReturnValue(Promise.resolve([user]));

			try {
				await service.create(user);
			} catch (error) {
				expect(error.message).toBe("Telefone já registrado no sistema");
			}
		});
	});

	describe("Consultar usuário", () => {
		it("deve retornar um usuário", async () => {
			const user = await createUser();
			jest.spyOn(repository, "find").mockReturnValue(Promise.resolve([user]));

			const returnedUser = await service.read({ id: user.id });

			expect(returnedUser[0]).toStrictEqual(user);
			expect(repository.find).toBeCalled();
			expect(repository.find).toBeCalledWith({ where: { id: user.id } });
		});

		it("deve retornar um erro dizendo que não existe um usuário com o id fornecido", async () => {
			jest.spyOn(repository, "find").mockReturnValue(Promise.resolve([]));

			try {
				await service.read({ id: 123 });
			} catch (error) {
				expect(error.message).toBe("Não foi encontrado um usuário com este ID");
			}
		});
	});
});
