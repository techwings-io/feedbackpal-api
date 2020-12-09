import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { FeedbackEventsService } from '../services/feedback-events.service';
import { CreateFeedbackEventDto } from '../dtos/create-feeback-event.dto';

import { FeedbackEvent } from '../persistence/feedback-event.entity';
import { FeedbackEventDatesValidationPipe } from '../pipes/feedback-event-dates-validation.pipe';
import { GetFeedbackEventsFilterDto } from '../dtos/get-feedback-events-filter.dto';
import { AuthGuard } from '@nestjs/passport';

import { PermissionsGuard } from '../../permissions/permission.guard';

import { Permissions } from '../../permissions/permission.decorator';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '../../shared/jwt/jwt.service';
import { PaginatedResultsDto } from 'src/shared/pagination/paginated-results-dto';

@Controller('/feedbackEvents')
export class FeedbackEventsController {
  private readonly logger = new Logger(FeedbackEventsController.name);
  constructor(
    private eventService: FeedbackEventsService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  @Get()
  @UsePipes(ValidationPipe, FeedbackEventDatesValidationPipe)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  async getFeedbackEvents(
    @Query()
    params,
    @Req() request: any
  ): Promise<PaginatedResultsDto<FeedbackEvent>> {
    console.log('params', params);

    const { user } = request;
    const getFeedbackEventsFilterDto = params;
    console.log('getFeedbackEventsFilterDto', params);

    if (getFeedbackEventsFilterDto) {
      // Transforms values to numbers
      getFeedbackEventsFilterDto.page = +getFeedbackEventsFilterDto.page;
      getFeedbackEventsFilterDto.limit =
        +getFeedbackEventsFilterDto.limit > 50
          ? 50
          : getFeedbackEventsFilterDto.limit;
    }

    let allRetrievedEvents = await this.eventService.getFeedbackEvents(
      getFeedbackEventsFilterDto,
      user
    );
    return allRetrievedEvents;
  }

  @Post()
  @UsePipes(ValidationPipe, FeedbackEventDatesValidationPipe)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:feedbackEvents')
  createEvent(
    @Body() createEventDto: CreateFeedbackEventDto,
    @Req() request: any
  ): Promise<FeedbackEvent> {
    console.log('Got request to create feedback event');

    const email = this.extractEmailFromRequest(request);

    //Will throw an exception if data not belonging to the user
    this.jwtService.checkTokenValidity(email, createEventDto.email);

    return this.eventService.createEvent(createEventDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  getUserEventById(
    @Param('id') id: string,
    @Req() request: any
  ): Promise<FeedbackEvent> {
    const { user } = request;

    return this.eventService.getUserEventById(id, user);
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
}
