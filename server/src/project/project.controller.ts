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
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Cron, Interval } from "@nestjs/schedule";
import { DeleteProjectDto } from "./dto/delete-project.dto";

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post("/create")
  async create(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto);
  }

  @Get()
  findAll(@Query() query: { isRelations: boolean }) {

    return this.projectService.findAll(query.isRelations);
  }

  @Get(":projectName")
  async findOne(@Param("projectName") projectName: string) {
    return this.projectService.findOneByName(projectName);
  }

  @Delete("/delete")
  remove(@Body() deleteProjectDto: DeleteProjectDto) {
    return this.projectService.remove(deleteProjectDto.projectName);
  }
}
