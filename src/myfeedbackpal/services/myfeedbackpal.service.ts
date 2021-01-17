import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackRepository } from 'src/feedback/persistence/feedback.repository';
import { PaginationDto } from '../../shared/pagination/pagination-dto';
import { Observable } from 'rxjs';
import { PaginatedResultsDto } from 'src/shared/pagination/paginated-results-dto';
import { Feedback } from 'src/feedback/persistence/feedback.entity';
import { MyFeedbacksDto } from '../dtos/get.myfeedbacks.dto';
import { FeedbackDto } from '../../feedback/dto/feeback.dto';
import { FeedbackEventRepository } from '../../events/persistence/feedback-event-repository';
import { FeedbackEventDto } from '../../events/dtos/feedback.event.dto';
import { FeedbackEvent } from 'src/events/persistence/feedback-event.entity';

@Injectable()
export class MyfeedbackpalService {
  constructor(
    @InjectRepository(FeedbackRepository)
    private feedbackRepository: FeedbackRepository,
    @InjectRepository(FeedbackEventRepository)
    private feedbackEventRepository: FeedbackEventRepository
  ) {}

  async getAllUserFeedback(
    userId: string,
    paginationDto: PaginationDto
  ): Promise<PaginatedResultsDto<MyFeedbacksDto>> {
    if (isNaN(paginationDto.page)) {
      paginationDto.page = 0;
    }
    if (isNaN(paginationDto.limit)) {
      paginationDto.limit = 10;
    }
    const skippedItems: number = (paginationDto.page - 1) * paginationDto.limit;

    const query = this.feedbackRepository
      .createQueryBuilder('feedback')
      .limit(paginationDto.limit)
      .offset(skippedItems);
    query.andWhere('feedback.createdBy = :userId', { userId });

    const feedbacks: Feedback[] = await query.getMany();
    const totalCount = await query.getCount();
    const feedbackData: MyFeedbacksDto[] = [];
    const results = new PaginatedResultsDto<MyFeedbacksDto>();
    const cachedEvents: Map<string, FeedbackEvent> = new Map();
    for (let feedback of feedbacks) {
      const fullFeedbackData = new MyFeedbacksDto();

      let eventData: FeedbackEvent;
      if (cachedEvents.has(feedback.eventId)) {
        eventData = cachedEvents.get(feedback.eventId);
      } else {
        eventData = await this.feedbackEventRepository.findOneOrFail(
          feedback.eventId
        );
        cachedEvents.set(feedback.eventId, eventData);
      }

      const eventDto = new FeedbackEventDto();
      eventDto.id = eventData.id;
      eventDto.eventName = eventData.eventName;
      eventDto.lastCreated = eventData.lastCreated;
      eventDto.lastUpdated = eventData.lastUpdated;
      eventDto.publicEvent = eventData.publicEvent;
      eventDto.totalFeedbacks = eventData.totalFeedbacks;
      eventDto.totalHappy = eventData.totalHappy;
      eventDto.totalNeutral = eventData.totalNeutral;
      eventDto.totalUnhappy = eventData.totalUnhappy;
      eventDto.usersToShareWith = eventData.usersToShareWith;
      eventDto.validFrom = eventData.validFrom;
      eventDto.validTo = eventData.validTo;
      fullFeedbackData.eventData = eventDto;

      const feedbackDto = new FeedbackDto();
      feedbackDto.id = feedback.id;
      feedbackDto.eventId = feedback.eventId;
      feedbackDto.createdBy = feedback.createdBy;
      feedbackDto.feeling = feedback.feeling;
      feedbackDto.lastCreated = feedback.lastCreated;
      feedbackDto.comments = feedback.comments;
      fullFeedbackData.feedbackData = feedbackDto;
      feedbackData.push(fullFeedbackData);
    }

    results.data = feedbackData;
    results.page = paginationDto.page;
    results.totalCount = totalCount;
    results.limit = +paginationDto.limit;
    return results;
  }
}
