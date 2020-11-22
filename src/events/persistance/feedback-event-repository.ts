import { EntityRepository, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FeedbackEvent } from './feedback-event.entity';
import { CreateFeedbackEventDto } from '../dtos/create-feeback-event.dto';
import { GetFeedbackEventsFilterDto } from '../dtos/get-feedback-events-filter.dto';
import * as moment from 'moment';

@EntityRepository(FeedbackEvent)
export class FeedbackEventRepository extends Repository<FeedbackEvent> {
  async createFeedbackEvent(createEventDto: CreateFeedbackEventDto) {
    const { name, description, createdBy, validFrom, validTo } = createEventDto;
    const event: FeedbackEvent = new FeedbackEvent();
    event.id = uuid();
    event.name = name;
    event.description = description;
    event.createdBy = createdBy;
    event.validFrom = validFrom;
    event.validTo = validTo;
    event.lastCreated = new Date();
    event.lastUpdated = new Date();

    return await event.save();
  }

  async getFeedbackEvents(
    getFeedbackEventsFilterDto: GetFeedbackEventsFilterDto
  ): Promise<FeedbackEvent[]> {
    const {
      validFrom,
      validTo,
      eventName,
      active,
    } = getFeedbackEventsFilterDto;
    const query = this.createQueryBuilder('feedback_event');
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
    return feedbackEvents;
  }
}
