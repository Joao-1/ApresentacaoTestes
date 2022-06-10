import { IsEmail, IsNumber, IsNumberString, IsPhoneNumber } from "class-validator";

export default class CreateUserDTO {
	name: string;

	@IsEmail()
	email: string;

	@IsNumber()
	age: number;

	@IsNumberString()
	cpf: string;

	@IsNumberString()
	phone: string;
}
