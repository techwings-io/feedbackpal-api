import { Module } from '@nestjs/common';
import { InfoController } from './info/info.controller';

@Module({
  controllers: [InfoController],
})
export class HealthModule {}
