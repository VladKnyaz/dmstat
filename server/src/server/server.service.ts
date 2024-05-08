import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateServerDto } from "./dto/create-server.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ServerEntity } from "./entities/server.entity";
import { Repository } from "typeorm";
import { ProjectService } from "src/project/project.service";
import { Interval } from "@nestjs/schedule";
import { IProject } from "src/shared/types";
import { ProjectEntity } from "src/project/entities/project.entity";
import { TimestampServerEntity } from "./entities/timestamp.entity";
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';
import * as fs from 'fs'



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
    const isX2 = createServerDto.serverName.includes("X2")

    createServerDto.serverName =
      createServerDto.serverName.replace(/\s*\[.*?\]\s*/g, '') // Убираем все квадратные скобки

    createServerDto.serverName =
      createServerDto.serverName.split("discord")[0] // Убираем все квадратные скобки

    const blackList = ['gangwar', 'bedwars', 'freeroam', 'drift', 'https']

    blackList.forEach((word) => {
      createServerDto.serverName = createServerDto.serverName.toLocaleLowerCase().replace(word, '').toLocaleUpperCase();
    })

    createServerDto.serverName = createServerDto.serverName.toLocaleLowerCase().replace(/,/g, '').replace('x2', '').toLocaleUpperCase();

    createServerDto.serverName = createServerDto.serverName.replace(/[^\s\d\w]/g, '').trim();

    createServerDto.serverName = createServerDto.serverName + (isX2 ? ' X2' : '');

    const servers = await this.serverRepository.find({ relations: ['timestamps'] })

    let maxLen = 0;
    let serverWithMaxLengthTimestamps: ServerEntity;

    servers.forEach(serv => {
      if (!serv.timestamps) return;
      if (serv.timestamps.length > maxLen) {
        serverWithMaxLengthTimestamps = serv;
        maxLen = serv.timestamps.length
      }
    })

    const server = await this.serverRepository.save(createServerDto);

    this.timestampRepository.create()

    serverWithMaxLengthTimestamps.timestamps.forEach((stamp) => {
      const servStamp = this.timestampRepository.create({
        server: server,
        date: stamp.date,
        amountPlayers: 0
      })
      this.timestampRepository.save(servStamp)
    })

    return server
  }

  async findAll() {
    return this.serverRepository.find();
  }

  /**
   * Проверяет каждый час есть ли новый сервер
   */
  // @Interval(60 * 111 * 60)
  @Interval(864_000_000)
  async checkingAllServersThereAreInDatabase() {
    try {

      const isUpdated = await this.projectService.checkUpdateProjectData()
      if (!isUpdated) return;

      let projects = await this.projectService.findAllDB()
      let stop = false
      projects.forEach(async (project) => {
        if (stop) return;
        let projectInRagempList = await this.projectService.getProjectFromRagemp(project.projectId)

        if (!projectInRagempList) {
          projectInRagempList = await this.projectService.getProjectFromRagemp(project.projectId)
        }

        if (!projectInRagempList) {
          stop = true;
          return
        }


        projectInRagempList.servers.forEach(async (rServer) => {
          let isNotNewServer = project.servers.find((server) => server.serverId === rServer.id)
          if (isNotNewServer) return;
          const newServer = rServer;
          await this.create({ serverId: newServer.id, project, serverName: newServer.name })
        })
      })
    } catch (e) {
      console.log(e);
    }
  }


  /**
   * сохраняет в бд онлайн серверов проектов раз в 3.5 минут
   */

  private findServers: number = 0;
  // @Interval(1000)
  @Interval(60 * 1000 * 3.5)
  async saveTimestampServer() {
    const isUpdated = await this.projectService.checkUpdateProjectData()
    if (!isUpdated) return;

    const newDate = new Date()

    let currentDate = newDate.toString();
    // currentDate = momenttz(newDate).utcOffset().toString()

    const prjectsLength: number = (await this.projectService.findMainInfo()).length

    try {
      let projectsFromRagemp: IProject[] =
        await this.projectService.getProjectsFromRagempByDatabase();

      if (!projectsFromRagemp || projectsFromRagemp.length !== prjectsLength) {
        projectsFromRagemp =
          await this.projectService.getProjectsFromRagempByDatabase();

      };

      if ((!projectsFromRagemp || projectsFromRagemp.length !== prjectsLength) && this.findServers <= 7) {
        this.findServers += 1
        setTimeout(() => {
          this.saveTimestampServer()
        }, 1000);
        return
      }


      this.findServers = 0;

      projectsFromRagemp.forEach(async (project) => {
        const findProjectInDatabase: ProjectEntity = await this.projectService.findOneById(
          project.idInDatabase,
        )

        if (!findProjectInDatabase.servers) return;

        findProjectInDatabase.servers.forEach(async (server: ServerEntity, index: number) => {

          let serverMp = project.servers.find(serv => serv.id === server.serverId)

          if (!serverMp || !serverMp.players) {
            console.log(project.servers);
            console.log(serverMp);

            return;
          }
          // serversTmpsData.push({ date: currentDate, server, amountPlayers: serverMp.players.amount })
          await this.timestampRepository.save({ date: currentDate, server, amountPlayers: serverMp.players.amount })



        });
      });



    }
    catch (e) {
      console.log(e);
    }
  }
}
