import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEventsController } from './controllers/feedback-events.controller';
import { FeedbackEventsService } from './services/feedback-events.service';

import { FeedbackEventRepository } from './persistence/feedback-event-repository';
import { SharedModule } from '../shared/shared.module';
import { FeedbackRepository } from 'src/feedback/persistence/feedback.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEventRepository, FeedbackRepository]),
    SharedModule,
  ],
  controllers: [FeedbackEventsController],
  providers: [FeedbackEventsService],
  exports: [FeedbackEventsService],
})
export class FeedbackEventsModule {}
