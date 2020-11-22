import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthzController } from './authz.controller';
import { AuthzService } from './authz.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [ConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthzController],
  providers: [AuthzService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
