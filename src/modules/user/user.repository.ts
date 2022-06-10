import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import PrismaService from "../../providers/prisma/prisma.service";

@Injectable()
export default class UserRepository {
	// eslint-disable-next-line prettier/prettier
	constructor(private prisma: PrismaService) { }

	async insert(userData: Prisma.UserCreateInput) {
		try {
			return this.prisma.user.create({ data: userData });
		} catch (error) {
			console.log(error);
			throw new HttpException("Erro ao consultar o banco de dados", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async find(params: Prisma.UserFindManyArgs) {
		try {
			return this.prisma.user.findMany(params);
		} catch (error) {
			console.log(error);
			throw new HttpException("Erro ao consultar o banco de dados", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
