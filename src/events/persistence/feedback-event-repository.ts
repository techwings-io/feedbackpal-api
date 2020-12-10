import { EntityRepository, Repository, EventSubscriber } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FeedbackEvent } from './feedback-event.entity';
import { CreateFeedbackEventDto } from '../dtos/create-feeback-event.dto';
import { GetFeedbackEventsFilterDto } from '../dtos/get-feedback-events-filter.dto';
import * as moment from 'moment';

import { PaginatedResultsDto } from '../../shared/pagination/paginated-results-dto';
import { FeedbackService } from '../../feedback/services/feedback.service';

@EntityRepository(FeedbackEvent)
export class FeedbackEventRepository extends Repository<FeedbackEvent> {
  constructor() {
    super();
  }
  async createFeedbackEvent(createEventDto: CreateFeedbackEventDto) {
    const {
      id,
      eventName,
      description,
      createdBy,
      email,
      publicEvent,
      usersToShareWith,
      validFrom,
      validTo,
    } = createEventDto;
    const event: FeedbackEvent = new FeedbackEvent();
    event.id = id ? id : uuid();
    event.eventName = eventName;
    event.description = description;
    event.createdBy = createdBy;
    event.email = email;
    event.publicEvent = publicEvent;
    event.usersToShareWith = usersToShareWith;
    event.validFrom = validFrom;
    event.validTo = validTo;
    event.lastCreated = new Date();
    event.lastUpdated = new Date();
    event.totalHappy = 0;
    event.totalNeutral = 0;
    event.totalUnhappy = 0;
    event.totalFeedbacks = 0;

    return await event.save();
  }

  async getFeedbackEvents(
    getFeedbackEventsFilterDto: GetFeedbackEventsFilterDto
  ): Promise<PaginatedResultsDto<FeedbackEvent>> {
    if (isNaN(getFeedbackEventsFilterDto.page)) {
      getFeedbackEventsFilterDto.page = 0;
    }
    if (isNaN(getFeedbackEventsFilterDto.limit)) {
      getFeedbackEventsFilterDto.limit = 10;
    }
    const skippedItems: number =
      (getFeedbackEventsFilterDto.page - 1) * getFeedbackEventsFilterDto.limit;
    const totalCount = await this.count();
    const {
      validFrom,
      validTo,
      eventName,
      active,
      page,
      limit,
    } = getFeedbackEventsFilterDto;
    const query = this.createQueryBuilder('feedback_event')
      .limit(limit)
      .offset(skippedItems);

    if (eventName) {
      query.andWhere(
        'feedback_event.name like :eventName or feedback_event.description like :eventName',
        {
          eventName: `%${eventName}%`,
        }
      );
    }
    if (active) {
      const now = moment.utc();
      query
        .andWhere('feedback_event.validTo >= :now', { now })
        .andWhere('feedback_event.validFrom <= :now', { now });
    }
    if (validFrom) {
      query.andWhere('feedback_event.validFrom >= :validFrom', { validFrom });
    }
    if (validTo) {
      query.andWhere('feedback_event.validTo <= :validTo', { validTo });
    }

    const feedbackEvents = await query.getMany();
    const paginatedResults: PaginatedResultsDto<FeedbackEvent> = new PaginatedResultsDto();
    paginatedResults.data = feedbackEvents;
    paginatedResults.page = page;
    paginatedResults.totalCount = totalCount;
    paginatedResults.limit = +limit;
    return paginatedResults;
  }
}
