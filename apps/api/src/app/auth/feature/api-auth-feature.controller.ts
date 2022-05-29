import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAuthDataAccessService,
  JwtAuthGuard,
  LocalAuthGuard,
} from '../data-access';

@Controller('auth')
export class ApiAuthFeatureController {
  constructor(private readonly service: ApiAuthDataAccessService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.service.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return req.user;
  }

  @Post('register')
  register(@Body() body) {
    return this.service.register(body);
  }
}
