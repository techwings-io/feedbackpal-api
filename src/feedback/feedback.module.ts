import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedbackRepository } from './persistence/feedback.repository';
import { SharedModule } from '../shared/shared.module';
import { FeedbackController } from './controllers/feedback.controller';
import { FeedbackService } from './services/feedback.service';
import { FeedbackEventsModule } from '../events/feedback-events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackRepository]),
    SharedModule,
    FeedbackEventsModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
