import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FeedbackRepository } from '../persistence/feedback.repository';
import { CreateFeedbackDto } from '../dto/create.feedback.dto';
import { Feedback } from '../persistence/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackRepository)
    private feedbackRepository: FeedbackRepository
  ) {}

  async storeFeedback(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return await this.feedbackRepository.createFeedbackEntry(createFeedbackDto);
  }
}
