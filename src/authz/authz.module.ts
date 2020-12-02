import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthzController } from './authz.controller';
import { AuthzService } from './authz.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '../shared/jwt/jwt.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule,
  ],
  controllers: [AuthzController],
  providers: [AuthzService, JwtStrategy, JwtService],
  exports: [PassportModule],
})
export class AuthModule {}
