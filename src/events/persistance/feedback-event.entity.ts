import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['eventName', 'email'])
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
  createdBy: string;
  @Column()
  email: string;
  @Column()
  lastCreated: Date;
  @Column()
  lastUpdated: Date;
}
