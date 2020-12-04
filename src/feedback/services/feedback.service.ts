import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FeedbackRepository } from '../persistence/feedback.repository';
import { CreateFeedbackDto } from '../dto/create.feedback.dto';
import { Feedback } from '../persistence/feedback.entity';
import { FeedbackEventsService } from '../../events/services/feedback-events.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackRepository)
    private feedbackRepository: FeedbackRepository,
    private feedbackEventService: FeedbackEventsService
  ) {}

  async storeFeedback(
    createFeedbackDto: CreateFeedbackDto,
    user: any
  ): Promise<Feedback> {
    const { eventId } = createFeedbackDto;
    const event = await this.feedbackEventService.getUserEventById(
      eventId,
      user
    );
    if (!event) {
      throw new BadRequestException('Could not find event with id: ', eventId);
    }
    // Authorised
    return await this.feedbackRepository.createFeedbackEntry(createFeedbackDto);
  }
}
