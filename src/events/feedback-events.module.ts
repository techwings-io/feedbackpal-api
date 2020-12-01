import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEventsController } from './feedback-events.controller';
import { FeedbackEventsService } from './feedback-events.service';
import { FeedbackEventRepository } from './persistance/feedback-event-repository';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEventRepository]), SharedModule],
  controllers: [FeedbackEventsController],
  providers: [FeedbackEventsService],
})
export class FeedbackEventsModule {}
