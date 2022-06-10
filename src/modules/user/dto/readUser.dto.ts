import { IsNumberString } from "class-validator";

export default class ReadUserDTO {
	@IsNumberString()
	id: number;
}
