import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TimestampServerEntity } from "./timestamp.entity";
import { ProjectEntity } from "src/project/entities/project.entity";

@Entity()
export class ServerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serverName: string;

  @Column()
  serverId: string;

  @OneToMany(() => TimestampServerEntity, (timestmp) => timestmp.server, {
    onDelete: "CASCADE",
  })
  timestamps: TimestampServerEntity[];

  @ManyToOne(() => ProjectEntity, (project) => project.servers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "projectId" })
  project: ProjectEntity;
}
