import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'
import { UserEntity } from "src/user/entities/user.entity";


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    public async login(password: string) {
        const adminName = process.env.NAME_ADMIN || "admin4444"
        const user = await this.validateUser(adminName, password)
        if (!user) return new UnauthorizedException('Пользователь не найден')
        return this.genToken(user.id)
    }

    public async register(password: string) {
        const adminName = process.env.NAME_ADMIN || "admin4444"

        const hashPassword = await bcrypt.hash(password, 7)
        const user = await this.userService.createUser(adminName, hashPassword)
        return await this.genToken(user.id)

    }

    private async genToken(id: number) {
        const payload = { id }
        return {
            token: this.jwtService.sign(payload)
        }
    }


    private async validateUser(name: string, password: string): Promise<UserEntity> {
        const user = await this.userService.getByName(name)
        if (!user) return null

        const isPass = await bcrypt.compare(password, user.password)
        if (!isPass) return null

        return user
    }

}

