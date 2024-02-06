import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServerEntity } from "./server.entity";

@Entity()
export class TimestampServerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  date: string;

  @Column()
  amountPlayers: number;

  @ManyToOne(() => ServerEntity, (serv) => serv.timestamps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "serverId" })
  server: ServerEntity;
}
