import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthzService {
  constructor(private configService: ConfigService) {}

  signIn() {}
}
