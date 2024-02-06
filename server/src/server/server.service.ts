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
import { TimestampServerEntity } from "./entities/timestamp.entity";

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(ServerEntity)
    private serverRepository: Repository<ServerEntity>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
    @InjectRepository(TimestampServerEntity)
    private timestampRepository: Repository<TimestampServerEntity>,
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

  async checkingAllServersThereAreInDatabase() {
    try {
      let projects = await this.projectService.findAll(true)
      projects.forEach(async (project) => {
        let projectInRagempList = await this.projectService.getProjectFromRagemp(project.projectName)

        if (projectInRagempList.servers.length > project.servers.length) {
          let amount = projectInRagempList.servers.length - project.servers.length;

          for (let i = 0; i < amount - 1; i++) {
            let len = projectInRagempList.servers.length;
            let server = projectInRagempList.servers[len - i];
            await this.create({ serverId: server.id, project, serverName: server.name })
          }
        }
      })
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * сохраняет в бд онлайн серверов проектов раз в 5 минут
   */
  @Interval(5 * 60 * 1000)
  async saveTimestampServer() {
    try {
      await this.checkingAllServersThereAreInDatabase();

      const projectsFromRagemp: IProject[] =
        await this.projectService.getProjectsFromRagempByDatabase();

      projectsFromRagemp.forEach(async (project) => {
        const findProjectInDatabase: ProjectEntity = await this.projectService.findOneById(
          project.idInDatabase,
        );
        if (!findProjectInDatabase.servers) return;

        findProjectInDatabase.servers.forEach(async (server: ServerEntity, index: number) => {

          let serverMp = project.servers.find(serv => serv.id === server.serverId)

          let tmpstamp = this.timestampRepository.create({ date: new Date().toString(), server, amountPlayers: serverMp.players.amount })
          await this.timestampRepository.save(tmpstamp);
        });
      });
    }
    catch (e) {
      console.log(e);
    }
  }
}
