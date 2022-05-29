import { Body, Controller, Post } from '@nestjs/common';
import { ApiAuthDataAccessService } from '../data-access';

@Controller('auth')
export class ApiAuthFeatureController {
  constructor(private readonly service: ApiAuthDataAccessService) {}

  @Post('register')
  register(@Body() body) {
    return this.service.register(body);
  }
}
