import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedbackEventDatesValidationPipe } from 'src/events/pipes/feedback-event-dates-validation.pipe';
import { PermissionsGuard } from 'src/permissions/permission.guard';
import { FeedbackService } from '../services/feedback.service';
import { Permissions } from '../../permissions/permission.decorator';
import { CreateFeedbackDto } from '../dto/create.feedback.dto';
import { Request } from 'express';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @UsePipes(ValidationPipe, FeedbackEventDatesValidationPipe)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:feedbackEvents')
  async storeFeedback(
    @Body() feedback: CreateFeedbackDto,
    @Req() request: any
  ) {
    const { user } = request;
    return await this.feedbackService.storeFeedback(feedback, user);
  }
}
