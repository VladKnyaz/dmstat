import { IsNumber, IsString } from "class-validator";
import { ProjectEntity } from "src/project/entities/project.entity";

export class CreateServerDto {
    @IsNumber()
    project: ProjectEntity;
    @IsString()
    serverName: string;
}
