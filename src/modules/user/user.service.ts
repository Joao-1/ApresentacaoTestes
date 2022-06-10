import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { sendEmail } from "../../helpers/sendMail";
import CreateUserDTO from "./dto/createUser.dto";
import ReadUserDTO from "./dto/readUser.dto";
import UserRepository from "./user.repository";

@Injectable()
export class UserService {
	// eslint-disable-next-line prettier/prettier
	constructor(private userRepository: UserRepository) { }
	async create(userData: CreateUserDTO): Promise<User> {
		if ((await this.userRepository.find({ where: { email: userData.email } })).length) {
			throw new HttpException("Email já registrado no sistema", HttpStatus.UNPROCESSABLE_ENTITY);
		}

		if ((await this.userRepository.find({ where: { cpf: userData.cpf } })).length) {
			throw new HttpException("CPF já registrado no sistema", HttpStatus.UNPROCESSABLE_ENTITY);
		}

		if ((await this.userRepository.find({ where: { phone: userData.phone } })).length) {
			throw new HttpException("Telefone já registrado no sistema", HttpStatus.UNPROCESSABLE_ENTITY);
		}
		const newUser = await this.userRepository.insert(userData);

		await sendEmail(userData.email);

		return newUser;
	}

	async read({ id }: ReadUserDTO) {
		const user = await this.userRepository.find({ where: { id } });

		if (!user.length) {
			throw new HttpException("Não foi encontrado um usuário com este ID", HttpStatus.NOT_FOUND);
		}

		return user;
	}
}
