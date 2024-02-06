import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ServerService } from "./server.service";
import { CreateServerDto } from "./dto/create-server.dto";
import { UpdateServerDto } from "./dto/update-server.dto";

@Controller("server")
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post("create")
  create(@Body() createServerDto: CreateServerDto) {
    return this.serverService.create(createServerDto);
  }

  @Get()
  findAll() {
    return this.serverService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.serverService.findOne(+id);
  }
}
