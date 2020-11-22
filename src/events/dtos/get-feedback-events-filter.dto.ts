import { IsDateString, IsOptional } from 'class-validator';

export class GetFeedbackEventsFilterDto {
  @IsOptional()
  @IsDateString()
  validFrom: Date;

  @IsOptional()
  @IsDateString()
  validTo: Date;

  @IsOptional()
  eventName: string;

  @IsOptional()
  active: boolean;
}
