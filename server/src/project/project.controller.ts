import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Cron, Interval } from "@nestjs/schedule";
import { DeleteProjectDto } from "./dto/delete-project.dto";

import * as fs from "fs"
import { JwtAuthGuard } from "src/auth/auth-jwt.guard";

@Controller("projects")
@UseGuards(JwtAuthGuard)
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
    const onlineInfoFile = fs.readFileSync('projectsInfo.json');
    //@ts-ignore
    return JSON.parse(onlineInfoFile)
  }

  @Get('/peak')
  async findAllPeakjson() {
    const peakInfoFile = fs.readFileSync('projectsInfoPeak.json');
    //@ts-ignore
    return JSON.parse(peakInfoFile)

  }


  @Get('/main')
  async findAllMainInfo() {
    return await this.projectService.findMainInfo();
  }


  @Get("/get/current")
  async getCurrentOnline() {
    return await this.projectService.getProjectsCurrentOnline();
  }

  @Delete("/delete")
  remove(@Body() deleteProjectDto: DeleteProjectDto) {
    return this.projectService.remove(deleteProjectDto.projectName);
  }

  @Get(":projectName")
  async findOne(@Param("projectName") projectName: string) {
    return this.projectService.findOneByName(projectName);
  }


}
