import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateFeedbackEventDto } from '../dtos/create-feeback-event.dto';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEventRepository } from '../persistence/feedback-event-repository';
import { FeedbackEvent } from '../persistence/feedback-event.entity';
import { GetFeedbackEventsFilterDto } from '../dtos/get-feedback-events-filter.dto';

@Injectable()
export class FeedbackEventsService {
  constructor(
    @InjectRepository(FeedbackEventRepository)
    private eventRepository: FeedbackEventRepository
  ) {}

  async createEvent(
    createEventDto: CreateFeedbackEventDto
  ): Promise<FeedbackEvent> {
    return this.eventRepository.createFeedbackEvent(createEventDto);
  }

  async deleteEvent(id: string): Promise<void> {
    const results = await this.eventRepository.delete(id);
    if (results.affected === 0) {
      throw new NotFoundException(`Event with id: ${id} not found.`);
    }
  }

  async getUserEventById(id: string, user: any): Promise<FeedbackEvent> {
    const found = await this.eventRepository.findOne(id);
    if (!this.isUserAllowedToSeeThisEvent(found, user)) {
      throw new UnauthorizedException(`User not authorised to see this event`);
    }
    return found;
  }

  async getFeedbackEvents(
    getFeedbackEventsFilterDto: GetFeedbackEventsFilterDto,
    user: any
  ): Promise<FeedbackEvent[]> {
    const feedbackEvents = await this.eventRepository.getFeedbackEvents(
      getFeedbackEventsFilterDto
    );
    const filteredEvents = feedbackEvents.filter((feedbackEvent) => {
      return this.isUserAllowedToSeeThisEvent(feedbackEvent, user);
    });
    return filteredEvents;
  }

  private isUserAllowedToSeeThisEvent(
    feedbackEvent: FeedbackEvent,
    user: any
  ): boolean {
    console.log('feedbackEvent.publicEvent', feedbackEvent.publicEvent);
    console.log(
      'feedbackEvent.createdBy === user.sub',
      feedbackEvent.createdBy === user.sub
    );
    console.log(
      'feedbackEvent.usersToShareWith.includes(user.sub)',
      feedbackEvent.usersToShareWith.includes(user.sub)
    );

    if (feedbackEvent.publicEvent) {
      return true;
    }
    // Private event. Has it been shared with the requesting user?
    return (
      feedbackEvent.createdBy === user.sub ||
      feedbackEvent.usersToShareWith.includes(user.sub)
    );
  }
}
