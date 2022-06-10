import { Module } from "@nestjs/common";
import PrismaModule from "../../providers/prisma/prisma.module";
import { UserController } from "./user.controller";
import UserRepository from "./user.repository";
import { UserService } from "./user.service";

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, UserRepository],
})
// eslint-disable-next-line prettier/prettier
export class UserModule { }
