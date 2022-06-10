import { Body, Controller, Get, HttpStatus, Param, Post, Res, ValidationPipe } from "@nestjs/common";
import CreateUserDTO from "./dto/createUser.dto";
import { Response } from "express";
import ReadUserDTO from "./dto/readUser.dto";
import { UserService } from "./user.service";
@Controller("user")
export class UserController {
	// eslint-disable-next-line prettier/prettier
	constructor(private readonly userService: UserService) { }

	@Post()
	async create(@Body(new ValidationPipe()) userData: CreateUserDTO, @Res() res: Response) {
		const newUser = await this.userService.create(userData);
		res.status(HttpStatus.CREATED).json({ status: "success", newUser });
	}

	@Get("/:id")
	async read(@Param(new ValidationPipe()) { id }: ReadUserDTO, @Res() res: Response) {
		const user = await this.userService.read({ id: +id });
		res.status(HttpStatus.OK).json({ status: "success", user });
	}
}
