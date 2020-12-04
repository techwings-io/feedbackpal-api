import { EntityRepository, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from '../dto/create.feedback.dto';

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  async createFeedbackEntry(createFeedbackDto: CreateFeedbackDto) {
    const {
      eventId,
      createdBy,
      lastCreated,
      comments,
      feeling,
    } = createFeedbackDto;
    const feedback: Feedback = new Feedback();
    feedback.eventId = eventId;
    feedback.createdBy = createdBy;
    feedback.lastCreated = lastCreated;
    feedback.comments = comments;
    feedback.feeling = feeling;

    return await this.save(feedback);
  }
}
