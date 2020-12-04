import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedbackEventDatesValidationPipe } from 'src/events/pipes/feedback-event-dates-validation.pipe';
import { PermissionsGuard } from 'src/permissions/permission.guard';
import { FeedbackService } from '../services/feedback.service';
import { Permissions } from '../../permissions/permission.decorator';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @UsePipes(ValidationPipe, FeedbackEventDatesValidationPipe)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:feedbackEvents')
  storeFeedback() {}
}
