import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TimestampProjectEntity } from "./timestamp.entity";
import { ServerEntity } from "src/server/entities/server.entity";

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column()
  color: string;

  @OneToMany(() => TimestampProjectEntity, (timestamps) => timestamps.project, {
    onDelete: "CASCADE",
  })
  timestamps: TimestampProjectEntity[];

  @OneToMany(() => ServerEntity, (serv) => serv.project, {
    onDelete: "CASCADE",
  })
  servers: ServerEntity[];
}
