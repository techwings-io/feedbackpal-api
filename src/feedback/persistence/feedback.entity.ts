import { Optional } from '@nestjs/common';
import { Feeling } from 'src/shared/model/feeling.enum';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Feedback extends BaseEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  @Index()
  eventId: string;
  @Column()
  @Index()
  createdBy: string;
  @Column()
  feeling: Feeling;
  @Column()
  @Optional()
  comments: string;
  @Column()
  lastCreated: Date;
}
