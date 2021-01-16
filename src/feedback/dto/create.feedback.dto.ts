import { Optional } from '@nestjs/common';
import { IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';
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
  @IsBoolean()
  private: boolean;
  @IsDateString()
  lastCreated: Date;
}
