import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Cron, Interval } from "@nestjs/schedule";

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post("create")
  async create(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectService.remove(+id);
  }
}
