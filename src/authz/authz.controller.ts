import { Controller, Get } from '@nestjs/common';
import { subscribeOn, tap } from 'rxjs/operators';

import { JwtService } from '../shared/jwt/jwt.service';
import { Auth0UserModel } from '../shared/model/auth0.user.model';
import { AxiosResponse } from 'axios';

@Controller('auth')
export class AuthzController {
  users: Auth0UserModel[] = [];
  constructor(private jwtService: JwtService) {}

  @Get('/token')
  async getAuth0Users(): Promise<Auth0UserModel[]> {
    return await this.jwtService.getUsers();
  }
}
