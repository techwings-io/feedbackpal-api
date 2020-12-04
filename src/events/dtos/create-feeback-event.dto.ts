import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateFeedbackEventDto {
  @IsNotEmpty()
  eventName: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  createdBy: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsBoolean()
  publicEvent: boolean;
  @IsArray()
  @Optional()
  usersToShareWith: string[];
  @IsNotEmpty()
  @IsDateString()
  validFrom: Date;
  @IsNotEmpty()
  @IsDateString()
  validTo: Date;
}
