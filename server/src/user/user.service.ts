import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    public async createUser(name: string, password: string) {
        const user = await this.userRepository.create({
            name,
            password,
        })
        return await this.userRepository.save(user)

    }

    public async getByName(name: string) {
        const user = await this.userRepository.findOne({
            where: {
                name
            }
        })
        return user

    }


}

