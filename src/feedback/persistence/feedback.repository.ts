import { EntityRepository, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from '../dto/create.feedback.dto';

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  async createFeedbackEntry(feedback: Feedback) {
    return await this.save(feedback);
  }
}
