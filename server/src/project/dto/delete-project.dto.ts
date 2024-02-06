import { IsString } from "class-validator";

export class DeleteProjectDto {
    @IsString()
    projectName: string;
}
