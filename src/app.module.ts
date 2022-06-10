import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import PrismaModule from "./providers/prisma/prisma.module";

@Module({
	imports: [UserModule, PrismaModule],
	controllers: [AppController],
	providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
