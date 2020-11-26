import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from './authz.service';
import { PermissionsGuard } from '../permissions/permission.guard';
import { Permissions } from 'src/permissions/permission.decorator';

@Controller('auth')
export class AuthzController {
  constructor(private authService: AuthzService) {}

  @Get('/signin')
  signIn() {
    this.authService.signIn();
  }

  @Post('/test/jwt')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  testJwt() {
    return { message: 'OK' };
  }
}
