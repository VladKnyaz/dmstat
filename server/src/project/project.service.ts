import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectEntity } from "./entities/project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServerEntity } from "src/server/entities/server.entity";
import { TimestampProjectEntity } from "./entities/timestamp.entity";
import { Cron, Interval } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { IProject, IProjectCurrentOnline } from "src/shared/types";
import { ServerService } from "src/server/server.service";

import * as fs from 'fs'

@Injectable()
export class ProjectService {
  private kek;
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(TimestampProjectEntity)
    private timestampRepository: Repository<TimestampProjectEntity>,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => ServerService))
    private serverService: ServerService,
  ) { }

  async create(createProjectDto: CreateProjectDto) {
    const projectFromRagemp: IProject = await this.getProjectFromRagempByName(createProjectDto.projectName)

    if (!projectFromRagemp) return new HttpException('Проект не найден', HttpStatus.NOT_FOUND);

    const itIsInDatabase = await this.projectRepository.findOne({
      where: {
        projectId: projectFromRagemp.id
      }
    });

    if (itIsInDatabase) {
      return {
        message: "Проект существует в базе"
      }
    }

    let projectInDatabase = this.projectRepository.create({ ...createProjectDto, projectId: projectFromRagemp.id });

    const projectNew = await this.projectRepository.save(projectInDatabase);

    projectFromRagemp.servers.forEach(server => {

      this.serverService.create({ project: projectInDatabase, serverName: server.name, serverId: server.id })
    })

    const projects = await this.projectRepository.find({ relations: ['timestamps'] })

    let maxLen = 0;
    let projectWithMaxLengthTimestamps: ProjectEntity;

    projects.forEach(proj => {
      if (!proj.timestamps) return;
      if (proj.timestamps.length > maxLen) {
        projectWithMaxLengthTimestamps = proj;
        maxLen = proj.timestamps.length
      }
    })

    projectWithMaxLengthTimestamps.timestamps.forEach((stamp) => {
      const servStamp = this.timestampRepository.create({
        project: projectNew,
        date: stamp.date,
        peak: 0
      })
      this.timestampRepository.save(servStamp)
    })

    return {
      message: "Проект создан"
    }
  }

  async getProjectFromRagemp(projectId: string): Promise<IProject> {
    const projectsFromRagemp: IProject[] = await this.httpService.axiosRef
      .get("https://cdn.rage.mp/master/v2/")
      .then((res) => res.data);
    if (projectsFromRagemp) {
      return projectsFromRagemp.find(project => project.id === projectId)
    }
    return;
  }

  async getProjectFromRagempByName(projectName: string): Promise<IProject> {
    projectName = projectName.toLocaleLowerCase();
    const projectsFromRagemp: IProject[] = await this.httpService.axiosRef
      .get("https://cdn.rage.mp/master/v2/")
      .then((res) => res.data);

    if (projectsFromRagemp) {
      return projectsFromRagemp.find(project => {
        const name = project.servers[0].name.toLocaleLowerCase();
        return name.includes(projectName);
      });
    }
    return;
  }

  async getProjectsFromRagempByDatabase(): Promise<IProject[]> {
    const projects = await this.findAll();
    const projectsFromRagemp: IProject[] = await this.httpService.axiosRef
      .get("https://cdn.rage.mp/master/v2/")
      .then((res) => res.data);

    if (!projectsFromRagemp) return;

    let projectsRagemp: IProject[] = [];
    projects.forEach((projc) => {

      let project: IProject = projectsFromRagemp.find((srv) => {
        return srv.id === projc.projectId
      });

      project &&
        projectsRagemp.push({ ...project, idInDatabase: projc.id });
    })

    return projectsRagemp;
  }

  /**
   * сохраняет в бд пиковый онлайн проекта в 23:59:59 за этот день
   */
  @Cron("59 59 23 * * * ", {
    timeZone: "Europe/Moscow"
  })
  async savePeaksProjects() {
    const projectsFromRagemp: IProject[] = await this.getProjectsFromRagempByDatabase();
    if (!projectsFromRagemp) return;
    const currentDate = new Date();
    projectsFromRagemp.forEach(async (project) => {
      const projectFromDatabase = await this.projectRepository.findOne({
        where: {
          id: project.idInDatabase,
        },
      });
      if (!projectFromDatabase) return;


      const prj = this.timestampRepository.create({
        project: projectFromDatabase,
        peak: project.players.peak,
        date: currentDate,
      });

      this.timestampRepository.save(prj);
    });
  }

  async getProjectsCurrentOnline() {
    try {
      const projectsInDB = await this.findMainInfo();
      const onlineInfoFile = fs.readFileSync('projectsInfo.json');

      if (!onlineInfoFile || !projectsInDB) throw new HttpException('Нет данных', HttpStatus.NOT_FOUND)
      //@ts-ignore
      const onlineInfo: any[] = JSON.parse(onlineInfoFile)

      if (!onlineInfo) throw new HttpException('Нет данных', HttpStatus.NOT_FOUND)

      let projects: IProjectCurrentOnline[] = []

      projectsInDB.forEach((project) => {
        let online = 0;
        let time: string;

        let onlineIfnoLength = onlineInfo.length

        // project.servers.forEach((serv) => {
        //   if (serv.timestamps.length < 1) {
        //     online += 0
        //     time = new Date().toString()
        //     return
        //   }

        //   online = online + serv.timestamps[serv.timestamps.length - 1].amountPlayers
        //   time = serv.timestamps[serv.timestamps.length - 1].date
        // })

        projects.push({
          projectName: project.projectName,
          projectId: project.projectId,
          currentOnline: onlineInfo[onlineIfnoLength - 1][project.projectName],
          time: onlineInfo[onlineIfnoLength - 1].time,
          color: project.color
        })
      })

      let dataProjects: IProjectCurrentOnline[] = []

      dataProjects = projects.sort((ap, bp) => bp.currentOnline - ap.currentOnline)

      return dataProjects
    } catch (e) {

      console.log(e);

      throw new HttpException('Нет данных', HttpStatus.NOT_FOUND)
    }

  }


  async findMainInfo() {
    return this.projectRepository.find()
  }


  @Interval(1000 * 60 * 5)
  async findAll(isRelations: boolean = true) {
    const start = new Date()
    console.log("Start", start)

    let relationsArray = ["servers", "servers.timestamps", "timestamps"];

    if (!isRelations) relationsArray = [];
    let allProjectsData = await this.projectRepository.find({ relations: relationsArray });

    let newDataProjectData = []

    let arrTimestamps: number[] = [];

    allProjectsData.forEach((project) => {
      // Считаем самый большой отрезок времени
      project.servers?.forEach((server) => {
        if (server.timestamps && server.timestamps.length > arrTimestamps.length) {
          arrTimestamps = server.timestamps.map((stamp) => new Date(stamp.date).getTime());
        }
      });
    });

    arrTimestamps.forEach((currentTime) => {
      let projects = {}
      allProjectsData.forEach(project => {
        let aa: number = 0
        project.servers.forEach(server => {
          let data = server.timestamps.find(ti => new Date(ti.date).getTime() === currentTime)
          if (data) {
            aa += data.amountPlayers
          }
        })

        projects[project.projectName] = aa;
      })

      newDataProjectData.push({
        time: new Date(currentTime),
        ...projects
      })
    })

    fs.writeFileSync('projectsInfo.json', JSON.stringify(newDataProjectData))

    const finish = new Date()
    console.log("Finish", finish)
    //@ts-ignore
    console.log("Time", `${finish - start}ms`)

    return newDataProjectData

  }

  findOneById(id: number) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ["servers", "servers.timestamps", "timestamps"],
    });
  }

  findOneByName(projectName: string) {
    return this.projectRepository.findOne({
      where: { projectName },
      relations: ["servers", "servers.timestamps", "timestamps"],
    });
  }

  async remove(projectName: string) {
    let project = await this.projectRepository.findOne({ where: { projectName } })

    if (!project) return new HttpException('Проект не найден', HttpStatus.NOT_FOUND)
    return this.projectRepository.remove(project)
  }
}
