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
  HttpException,
  HttpStatus,
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
    const ans: any[] = JSON.parse(onlineInfoFile)

    if (!ans || ans.length < 1) return [];
    const startDateWeak = 12
    var date = new Date(ans[ans.length - 1].time);

    date.setDate(date.getDate() - startDateWeak);

    return ans.filter((info) => {
      if (new Date(info.time).getTime() >= date.getTime()) return info
    })
  }

  @Get('/peak')
  async findAllPeakjson() {
    const peakInfoFile = fs.readFileSync('projectsInfoPeak.json');
    //@ts-ignore
    const ans: any[] = JSON.parse(peakInfoFile)

    if (!ans || ans.length < 1) return [];

    return ans

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
    try {
      let projctName = projectName.replace(new RegExp(" ", "g"), "_").toLocaleLowerCase();

      if (!fs.existsSync('projectsFiles') || !fs.existsSync(`projectsFiles/${projctName}.json`)) return [];

      const serversOnline = fs.readFileSync(`projectsFiles/${projctName}.json`);
      //@ts-ignore
      const ans: any[] = JSON.parse(serversOnline)

      if (!ans || ans.length < 1) return [];

      return ans
    } catch (e) {
      console.log(e.message);

      throw new HttpException('Файл не найден', HttpStatus.NOT_FOUND)

    }
  }


}
