import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FeedbackEventsService } from './feedback-events.service';
import { CreateFeedbackEventDto } from './dtos/create-feeback-event.dto';

import { FeedbackEvent } from './persistance/feedback-event.entity';
import { FeedbackEventDatesValidationPipe } from './pipes/feedback-event-dates-validation.pipe';
import { GetFeedbackEventsFilterDto } from './dtos/get-feedback-events-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { PermissionsGuard } from '../permissions/permission.guard';

import { Permissions } from '../permissions/permission.decorator';

@Controller('/feedbackEvents')
export class FeedbackEventsController {
  private readonly logger = new Logger(FeedbackEventsController.name);
  constructor(private eventService: FeedbackEventsService) {}

  @Post()
  @UsePipes(ValidationPipe, FeedbackEventDatesValidationPipe)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:feedbackEvents')
  createEvent(
    @Body() createEventDto: CreateFeedbackEventDto
  ): Promise<FeedbackEvent> {
    return this.eventService.createEvent(createEventDto);
  }

  @Get()
  @UsePipes(ValidationPipe, FeedbackEventDatesValidationPipe)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  getFeedbackEvents(
    @Body()
    getFeedbackEventsFilterDto: GetFeedbackEventsFilterDto
  ): Promise<FeedbackEvent[]> {
    return this.eventService.getFeedbackEvents(getFeedbackEventsFilterDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  getEventById(@Param('id') id: string): Promise<FeedbackEvent> {
    return this.eventService.getEventById(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete:feedbackEvents')
  deleteEvent(@Param('id') id: string): Promise<void> {
    return this.eventService.deleteEvent(id);
  }
}
