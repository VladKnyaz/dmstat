
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";


@Controller("auth")
export class AuthController {
    constructor(private readonly auhtService: AuthService) { }

    @Post("/login")
    async login(@Body() body: { password: string }) {
        return await this.auhtService.login(body.password)
    }


    @Post("/register")
    async register(@Body() body: { password: string }) {
        if (!body || !body.password) return 'Требуется пароль'
        return await this.auhtService.register(body.password)
    }

}
