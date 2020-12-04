import { Optional } from '@nestjs/common';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { Feeling } from 'src/shared/model/feeling.enum';

export class CreateFeedbackDto {
  @IsNotEmpty()
  eventId: string;
  @IsNotEmpty()
  createdBy: string;
  @IsNotEmpty()
  feeling: Feeling;
  @Optional()
  comments: string;
  @IsDateString()
  lastCreated: Date;
}
