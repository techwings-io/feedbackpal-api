import { FeedbackDto } from '../../feedback/dto/feeback.dto';
import { FeedbackEventDto } from '../../events/dtos/feedback.event.dto';

export class MyFeedbacksDto {
  feedbackData: FeedbackDto;
  eventData: FeedbackEventDto;
}
