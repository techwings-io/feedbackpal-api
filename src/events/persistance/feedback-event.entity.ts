import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class FeedbackEvent extends BaseEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  validFrom: Date;
  @Column()
  validTo: Date;
  @Column()
  createdBy: string;
  @Column()
  lastCreated: Date;
  @Column()
  lastUpdated: Date;
}
