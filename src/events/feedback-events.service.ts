import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateFeedbackEventDto } from './dtos/create-feeback-event.dto';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEventRepository } from './persistance/feedback-event-repository';
import { FeedbackEvent } from './persistance/feedback-event.entity';
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

  async getEventById(id: string): Promise<FeedbackEvent> {
    const found = await this.eventRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Event with id: ${id} not found.`);
    }
    return found;
  }

  async getFeedbackEvents(
    getFeedbackEventsFilterDto: GetFeedbackEventsFilterDto
  ): Promise<FeedbackEvent[]> {
    return this.eventRepository.getFeedbackEvents(getFeedbackEventsFilterDto);
  }
}
