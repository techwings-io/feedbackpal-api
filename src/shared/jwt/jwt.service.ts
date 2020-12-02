import { HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, take, map } from 'rxjs/operators';
import { Auth0UserModel } from '../model/auth0.user.model';

@Injectable()
export class JwtService {
  private auth0AdminTokenUrl;

  private auth0AdminUserUrl;

  private auth0AdminToken: string;

  private users: Auth0UserModel[] = [];

  constructor(
    private configService: ConfigService,
    private httpService: HttpService
  ) {
    this.auth0AdminUserUrl = `https://${configService.get(
      'AUTH0_DOMAIN'
    )}/api/v2/users?fields=name,email,picture,user_id&search_engine=v3&;`;
    this.auth0AdminTokenUrl = `https://${configService.get(
      'AUTH0_DOMAIN'
    )}/oauth/token`;
  }

  checkTokenValidity(emailFromJwt: string, emailFromData): void {
    if (emailFromJwt !== emailFromData) {
      const errorMessage = 'Unauthorised';
      console.log(errorMessage);
      throw new UnauthorizedException({
        errorMessage,
      });
    }
  }

  private async getAuth0AdminApiToken(): Promise<AxiosResponse<string>> {
    return this.httpService
      .post(this.auth0AdminTokenUrl, {
        client_id: this.configService.get('AUTH0_ADMIN_API_CLIENT_ID'),
        client_secret: this.configService.get('AUTH0_ADMIN_API_CLIENT_SECRET'),
        audience: `https://${this.configService.get('AUTH0_DOMAIN')}/api/v2/`,
        grant_type: 'client_credentials',
      })
      .toPromise();
  }

  async getUsers(): Promise<Auth0UserModel[]> {
    const response: any = await this.getAuth0AdminApiToken();

    const usersPromise = await this.httpService
      .get<Auth0UserModel[]>(this.auth0AdminUserUrl, {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      })
      .toPromise();

    this.users = await usersPromise.data;
    return this.users;
  }

  retrieveUsers() {
    return this.users;
  }
}
