import { EntityRepository, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from '../dto/create.feedback.dto';

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  async createFeedbackEntry(feedback: Feedback): Promise<Feedback> {
    return await this.save(feedback);
  }

  async deleteAllFeedbacksForEvent(eventId: string): Promise<void> {
    const feedbacks: Feedback[] = await this.find({
      eventId,
    });
    await feedbacks.forEach((feedback) => {
      this.delete(feedback.id);
    });
    console.log(
      `All feedbacks associated with event id: ${eventId} have been deleted`
    );
  }
}
