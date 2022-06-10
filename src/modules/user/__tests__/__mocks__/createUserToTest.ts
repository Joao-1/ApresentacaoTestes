import { faker } from "@faker-js/faker";

export default async () => {
	return {
		id: parseInt(faker.random.numeric()),
		name: faker.internet.userName(),
		cpf: faker.random.numeric(11),
		email: faker.internet.email(),
		age: faker.datatype.number({ min: 18, max: 100 }),
		phone: faker.phone.phoneNumber("55##########"),
	};
};
