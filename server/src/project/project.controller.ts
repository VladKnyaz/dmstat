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

import * as fs from "fs"

@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post("/create")
  async create(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.create(createProjectDto);
  }

  @Get('findall2222222222')
  async findAllQuery(@Query() query: { isRelations: boolean }) {
    return await this.projectService.findAll(true);
  }

  @Get()
  async findAlljson() {

    const test = fs.readFileSync('test.json');
    //@ts-ignore
    let a = JSON.parse(test)
    return a

  }

  @Get("/get/current")
  async getCurrentOnline() {
    return await this.projectService.getProjectsCurrentOnline();
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
