import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProjectEntity } from "./project.entity";

@Entity()
export class TimestampProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  date: Date;

  @ManyToOne(() => ProjectEntity, (project) => project.timestamps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "projectId" })
  project: ProjectEntity;

  @Column()
  peak: number;

}
