import { Module } from '@nestjs/common';
import { MyfeedbackpalController } from './controllers/myfeedbackpal.controller';

@Module({
  controllers: [MyfeedbackpalController],
})
export class MyfeedbackpalModule {}
