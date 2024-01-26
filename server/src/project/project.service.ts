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
import { IProject } from "src/shared/types";
import { ServerService } from "src/server/server.service";

@Injectable()
export class ProjectService {
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
    const projectFromRagemp: IProject = await this.getProjectFromRagemp(createProjectDto.projectName)

    if (!projectFromRagemp) return new HttpException('НЕТ ТАКОГО СЕРВЕРА', HttpStatus.NOT_FOUND);

    let projectInDatabase = await this.projectRepository.save(createProjectDto);

    projectFromRagemp.servers.forEach(server => {
      this.serverService.create({ project: projectInDatabase, serverName: server.name })
    })

    return true;
  }

  async getProjectFromRagemp(name: string): Promise<IProject> {
    const projectsFromRagemp: IProject[] = await this.httpService.axiosRef
      .get("https://cdn.rage.mp/master/v2/")
      .then((res) => res.data);

    return projectsFromRagemp.find(project => project.servers[0].name.toLowerCase().includes(name.toLowerCase()))
  }

  async getProjectsFromRagemp(): Promise<IProject[]> {
    const projects = await this.findAll();

    const projectsNames = projects.map((srv) => srv.projectName);

    const projectsFromRagemp: IProject[] = await this.httpService.axiosRef
      .get("https://cdn.rage.mp/master/v2/")
      .then((res) => res.data);

    let projectsRagemp: IProject[] = [];

    projectsNames.forEach((name) => {
      let nameProject: string = name.toLowerCase();

      let project: IProject = projectsFromRagemp.find((srv) => {
        let nameServer = srv.servers[0].name.toLowerCase();
        return nameServer.includes(nameProject);
      });

      const projectIdInDatabase = projects.find(
        (prj) => prj.projectName === name,
      ).id;

      project &&
        projectsRagemp.push({ ...project, idInDatabase: projectIdInDatabase });
    });

    return projectsRagemp;
    // console.log(new Date().toLocaleString());
  }

  /**
   * сохраняет в бд пиковый онлайн проекта в 23:59:59 за этот день
   */
  @Cron("59 59 23 * * * ")
  async saveTimestampsProjects() {
    const projectsFromRagemp: IProject[] = await this.getProjectsFromRagemp();

    projectsFromRagemp.forEach(async (project) => {
      const projectFromDatabase = await this.projectRepository.findOne({
        where: {
          id: project.idInDatabase,
        },
      });
      const date = new Date();
      const prj = this.timestampRepository.create({
        project: projectFromDatabase,
        peak: project.players.peak,
        date,
      });

      this.timestampRepository.save(prj);
    });
  }

  findAll() {
    return this.projectRepository.find();
  }

  findOne(id: number, relations: boolean = true) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ["servers", "servers.timestamps", "timestamps"],
    });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
