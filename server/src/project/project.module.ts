import { Module, forwardRef } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectEntity } from "./entities/project.entity";
import { TimestampProjectEntity } from "./entities/timestamp.entity";
import { HttpModule } from "@nestjs/axios";
import { ServerModule } from "src/server/server.module";

@Module({
  imports: [
    HttpModule,
    forwardRef(() => ServerModule),
    TypeOrmModule.forFeature([ProjectEntity, TimestampProjectEntity]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule { }
