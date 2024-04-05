
import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt'
import 'dotenv/config'
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    exports: [],
})
export class UserModule { }
