import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAuthDataAccessService,
  JwtAuthGuard,
  LocalAuthGuard,
  SolanaAuthGuard,
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

  @Get('request-challenge/:publicKey')
  requestChallenge(@Param('publicKey') publicKey: string) {
    return this.service.requestChallenge(publicKey);
  }

  @UseGuards(SolanaAuthGuard)
  @Post('respond-challenge')
  respondChallenge(@Request() req) {
    return this.service.login(req.user);
  }
}
