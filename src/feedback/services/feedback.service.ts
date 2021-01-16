import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FeedbackRepository } from '../persistence/feedback.repository';
import { CreateFeedbackDto } from '../dto/create.feedback.dto';
import { Feedback } from '../persistence/feedback.entity';
import { FeedbackEventsService } from '../../events/services/feedback-events.service';
import { v4 as uuid } from 'uuid';
import { Feeling } from 'src/shared/model/feeling.enum';

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
    // Entitlements are managed by the service
    const event = await this.feedbackEventService.getUserEventById(
      eventId,
      user
    );
    if (!event) {
      throw new BadRequestException('Could not find event with id: ', eventId);
    }

    let feedback = new Feedback();
    feedback.id = uuid();
    feedback.comments = createFeedbackDto.comments;
    feedback.createdBy = createFeedbackDto.createdBy;
    feedback.eventId = eventId;
    feedback.feeling = createFeedbackDto.feeling;
    feedback.lastCreated = createFeedbackDto.lastCreated;
    feedback.private = createFeedbackDto.private;
    // Authorised
    const retValue = await this.feedbackRepository.createFeedbackEntry(
      feedback
    );
    // Updates the counter
    await this.feedbackEventService
      .updateFeedbackEventCounter(eventId, feedback.feeling)
      .then(() => {
        console.log('Totals saved successfully');
      })
      .catch((err) =>
        console.log('An error occurred while saving totals', err)
      );
    return retValue;
  }
}
