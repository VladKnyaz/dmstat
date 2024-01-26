import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateServerDto } from "./dto/create-server.dto";
import { UpdateServerDto } from "./dto/update-server.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ServerEntity } from "./entities/server.entity";
import { Repository } from "typeorm";
import { ProjectService } from "src/project/project.service";
import { Cron, Interval } from "@nestjs/schedule";
import { IProject, IServerFromRagemp } from "src/shared/types";
import { ProjectEntity } from "src/project/entities/project.entity";

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(ServerEntity)
    private serverRepository: Repository<ServerEntity>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) { }

  async create(createServerDto: CreateServerDto) {
    createServerDto.serverName = createServerDto.serverName.replace(/[^\w\s]/gi, '')
    return await this.serverRepository.save(createServerDto);
  }

  async findAll() {
    return this.serverRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} server`;
  }

  update(id: number, updateServerDto: UpdateServerDto) {
    return `This action updates a #${id} server`;
  }

  remove(id: number) {
    return `This action removes a #${id} server`;
  }

  /**
   * сохраняет в бд онлайн серверов проектов раз в 5 минут
   */
  // @Interval(5 * 60 * 1000)
  // @Interval(2000)
  async saveTimestampServer() {
    const projectsFromRagemp: IProject[] =
      await this.projectService.getProjectsFromRagemp();

    projectsFromRagemp.forEach(async (project) => {
      const findProjectInDatabase: ProjectEntity = await this.projectService.findOne(
        project.idInDatabase,
      );

      if (!findProjectInDatabase.servers) return;

      findProjectInDatabase.servers.forEach((server: ServerEntity, index: number) => {
        // console.log(server);

      });
    });
  }
}
