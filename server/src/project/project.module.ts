import { Module, forwardRef } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectEntity } from "./entities/project.entity";
import { TimestampProjectEntity } from "./entities/timestamp.entity";
import { HttpModule } from "@nestjs/axios";
import { ServerModule } from "src/server/server.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { ServerEntity } from "src/server/entities/server.entity";

@Module({
  imports: [
    HttpModule,
    forwardRef(() => ServerModule),
    AuthModule,
    TypeOrmModule.forFeature([ProjectEntity, TimestampProjectEntity, ServerEntity]),

  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule { }
