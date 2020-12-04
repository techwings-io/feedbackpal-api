import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateFeedbackEventDto } from './dtos/create-feeback-event.dto';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEventRepository } from './persistence/feedback-event-repository';
import { FeedbackEvent } from './persistence/feedback-event.entity';
import { GetFeedbackEventsFilterDto } from './dtos/get-feedback-events-filter.dto';

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

  async getEventById(id: string, jwtEmail: string): Promise<FeedbackEvent> {
    const found = await this.eventRepository.findOne(id);
    if (!found || (found.email !== jwtEmail && !found.publicEvent)) {
      throw new NotFoundException(`Event with id: ${id} not found.`);
    }
    return found;
  }

  async getFeedbackEvents(
    getFeedbackEventsFilterDto: GetFeedbackEventsFilterDto,
    jwtEmail: string
  ): Promise<FeedbackEvent[]> {
    const feedbackEvents = await this.eventRepository.getFeedbackEvents(
      getFeedbackEventsFilterDto
    );
    const filteredEvents = feedbackEvents.filter((feedbackEvent) => {
      return feedbackEvent.publicEvent || feedbackEvent.email === jwtEmail;
    });
    return filteredEvents;
  }
}
