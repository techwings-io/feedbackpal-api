import { Optional } from '@nestjs/common';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['eventName'])
export class FeedbackEvent extends BaseEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  eventName: string;
  @Column()
  description: string;
  @Column()
  validFrom: Date;
  @Column()
  validTo: Date;
  @Column()
  @Index()
  createdBy: string;
  @Column()
  @Index()
  email: string;
  @Column({
    default: false,
  })
  publicEvent: boolean;
  @Column('varchar', { array: true, nullable: true })
  usersToShareWith: string[];
  lastCreated: Date;
  @Column()
  lastUpdated: Date;
  @Column('int')
  totalHappy: number;
  @Column('int')
  totalNeutral: number;
  @Column('int')
  totalUnhappy: number;
  @Column('int')
  totalFeedbacks: number;
}
