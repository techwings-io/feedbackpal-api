import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateFeedbackEventDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  createdBy: string;
  @IsNotEmpty()
  @IsDateString()
  validFrom: Date;
  @IsNotEmpty()
  @IsDateString()
  validTo: Date;
}
