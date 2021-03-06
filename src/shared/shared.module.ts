import { HttpModule, Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';

@Module({
  imports: [HttpModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class SharedModule {}
