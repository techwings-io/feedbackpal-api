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
import { Feeling } from 'src/shared/model/feeling.enum';
import { PaginatedResultsDto } from '../../shared/pagination/paginated-results-dto';

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
  ): Promise<PaginatedResultsDto<FeedbackEvent>> {
    const paginatedResults = await this.eventRepository.getFeedbackEvents(
      getFeedbackEventsFilterDto
    );
    const filteredEvents = paginatedResults.data.filter((feedbackEvent) => {
      return this.isUserAllowedToSeeThisEvent(feedbackEvent, user);
    });
    paginatedResults.data = filteredEvents;
    return paginatedResults;
  }

  async updateFeedbackEventCounter(
    eventId: string,
    feeling: Feeling
  ): Promise<FeedbackEvent> {
    const event = await this.eventRepository.findOneOrFail(eventId);
    switch (feeling) {
      case Feeling.HAPPY:
        event.totalHappy += 1;
        break;

      case Feeling.NEUTRAL:
        event.totalNeutral += 1;
        break;
      case Feeling.ANGRY:
        event.totalUnhappy += 1;
        break;
    }
    return await this.eventRepository.save(event);
  }

  //-----> Private stuff

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
