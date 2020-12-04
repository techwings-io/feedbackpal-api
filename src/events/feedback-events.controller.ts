import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
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

import { PermissionsGuard } from '../permissions/permission.guard';

import { Permissions } from '../permissions/permission.decorator';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '../shared/jwt/jwt.service';

@Controller('/feedbackEvents')
export class FeedbackEventsController {
  private readonly logger = new Logger(FeedbackEventsController.name);
  constructor(
    private eventService: FeedbackEventsService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  @Post()
  @UsePipes(ValidationPipe, FeedbackEventDatesValidationPipe)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:feedbackEvents')
  createEvent(
    @Body() createEventDto: CreateFeedbackEventDto,
    @Req() request: any
  ): Promise<FeedbackEvent> {
    const email = this.extractEmailFromRequest(request);

    //Will throw an exception if data not belonging to the user
    this.jwtService.checkTokenValidity(email, createEventDto.email);

    return this.eventService.createEvent(createEventDto);
  }

  @Get()
  @UsePipes(ValidationPipe, FeedbackEventDatesValidationPipe)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  async getFeedbackEvents(
    @Body()
    getFeedbackEventsFilterDto: GetFeedbackEventsFilterDto,
    @Req() request: any
  ): Promise<FeedbackEvent[]> {
    const email = this.extractEmailFromRequest(request);
    let allRetrievedEvents = await this.eventService.getFeedbackEvents(
      getFeedbackEventsFilterDto,
      email
    );
    allRetrievedEvents = this.extractEventsUserIsEntitledToSee(
      request,
      allRetrievedEvents
    );
    return allRetrievedEvents;
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  getEventById(
    @Param('id') id: string,
    @Req() request: any
  ): Promise<FeedbackEvent> {
    const email = this.extractEmailFromRequest(request);

    return this.eventService.getEventById(id, email);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete:feedbackEvents')
  deleteEvent(@Param('id') id: string): Promise<void> {
    return this.eventService.deleteEvent(id);
  }

  private extractEmailFromRequest(request: any): string {
    const { user } = request;

    const emailPrefix = `${this.configService.get('JWT_NS_PREFIX')}/email`;
    const email = user[emailPrefix];
    if (!email) {
      const errorMessage =
        'It was not possible to extract the email from the request object';
      console.log(errorMessage);
      throw new BadRequestException({
        errorMessage,
      });
    }
    return email;
  }

  private extractEventsUserIsEntitledToSee(
    request: any,
    events: FeedbackEvent[]
  ) {
    const { user } = request;
    console.log('user sub', user.sub);

    return events.filter((event) => {
      console.log('event.createdBy === user.sub', event.createdBy === user.sub);
      console.log('publicEvent', event.publicEvent);
      console.log(
        'event.usersToShareWith.includes(user.sub)',
        event.usersToShareWith.includes(user.sub)
      );

      return (
        event.createdBy === user.sub ||
        event.publicEvent ||
        event.usersToShareWith.includes(user.sub)
      );
    });
  }
}
