import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MyfeedbackpalController } from './controllers/myfeedbackpal.controller';
import { MyfeedbackpalService } from './services/myfeedbackpal.service';
import { FeedbackEventRepository } from 'src/events/persistence/feedback-event-repository';
import { FeedbackRepository } from 'src/feedback/persistence/feedback.repository';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEventRepository, FeedbackRepository]),
    SharedModule,
  ],
  controllers: [MyfeedbackpalController],
  providers: [MyfeedbackpalService],
})
export class MyfeedbackpalModule {}
