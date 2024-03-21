import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectModule } from "./project/project.module";
import { ServerModule } from "./server/server.module";
import { ServerEntity } from "./server/entities/server.entity";
import { TimestampProjectEntity } from "./project/entities/timestamp.entity";
import { TimestampServerEntity } from "./server/entities/timestamp.entity";
import { ProjectEntity } from "./project/entities/project.entity";
import { ScheduleModule } from "@nestjs/schedule";
import 'dotenv/config'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_DB,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      entities: [
        ServerEntity,
        TimestampProjectEntity,
        TimestampServerEntity,
        ProjectEntity,
      ],
      synchronize: true, // убрать при продакшене
    }),
    ProjectModule,
    ServerModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
