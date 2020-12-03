import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/permissions/permission.guard';
import { Permissions } from '../permissions/permission.decorator';

import { JwtService } from '../shared/jwt/jwt.service';
import { Auth0UserModel } from '../shared/model/auth0.user.model';

@Controller('auth')
export class AuthzController {
  users: Auth0UserModel[] = [];
  constructor(private jwtService: JwtService) {}

  @Get('/auth0-users')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  async getAuth0Users(
    @Query('userName') userName: string
  ): Promise<Auth0UserModel[]> {
    console.log('userName', userName);

    return await this.jwtService.getUsers(userName);
  }
}
