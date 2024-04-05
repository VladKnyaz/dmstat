
import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from '@nestjs/jwt'
import 'dotenv/config'
import { UserService } from "src/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { JwtAuthGuard } from "./auth-jwt.guard";
import { UserModule } from "src/user/user.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService],
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: process.env.PRIVATEKEY || 'SUPERSECRET2',
            signOptions: {
                expiresIn: '24h'
            }
        })
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }
