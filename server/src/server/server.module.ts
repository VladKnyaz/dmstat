import { Module, forwardRef } from "@nestjs/common";
import { ServerService } from "./server.service";
import { ServerController } from "./server.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServerEntity } from "./entities/server.entity";
import { ProjectModule } from "src/project/project.module";

@Module({
  imports: [TypeOrmModule.forFeature([ServerEntity]), forwardRef(() => ProjectModule)],
  controllers: [ServerController],
  providers: [ServerService],
  exports: [ServerService]
})
export class ServerModule { }
