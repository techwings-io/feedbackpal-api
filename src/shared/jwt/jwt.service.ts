import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtService {
  checkTokenValidity(emailFromJwt: string, emailFromData) {
    if (emailFromJwt !== emailFromData) {
      const errorMessage = 'Unauthorised';
      console.log(errorMessage);
      throw new UnauthorizedException({
        errorMessage,
      });
    }
  }
}
