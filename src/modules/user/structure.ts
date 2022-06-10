import { Prisma, User } from "@prisma/client";
import CreateUserDTO from "./dto/createUser.dto";
import ReadUserDTO from "./dto/readUser.dto";

export const _IUserService = "IUSERSERVICE";
export interface IUserService {
	create(userData: CreateUserDTO): Promise<User>;
	read({ id }: ReadUserDTO): Promise<User[]>;
}

export const _IUserRepository = "IUSERREPOSITORY";
export interface IUserRepository {
	insert(userData: Prisma.UserCreateInput): Promise<User>;
	find(params: Prisma.UserFindManyArgs): Promise<User[]>;
}
