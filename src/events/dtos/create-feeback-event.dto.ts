import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateFeedbackEventDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  createdBy: string;
  @IsNotEmpty()
  @IsEmail()
  email;
  @IsNotEmpty()
  @IsDateString()
  validFrom: Date;
  @IsNotEmpty()
  @IsDateString()
  validTo: Date;
}
