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
  @Column({ default: 0 })
  totalHappy: number;
  @Column({ default: 0 })
  totalNeutral: number;
  @Column({ default: 0 })
  totalUnhappy: number;
}
