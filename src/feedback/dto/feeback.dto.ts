import { Feeling } from 'src/shared/model/feeling.enum';

export class FeedbackDto {
  id: string;
  eventId: string;
  createdBy: string;
  feeling: Feeling;
  comments: string;
  private: boolean;
  lastCreated: Date;
}
