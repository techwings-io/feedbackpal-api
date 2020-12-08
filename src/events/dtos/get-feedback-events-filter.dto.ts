import { IsDateString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../shared/pagination/pagination-dto';

export class GetFeedbackEventsFilterDto extends PaginationDto {
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
