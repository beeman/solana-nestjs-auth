import { Controller, Get, Param } from '@nestjs/common';
import { ApiUserDataAccessService } from '../data-access';

@Controller('user')
export class ApiUserFeatureController {
  constructor(private readonly service: ApiUserDataAccessService) {}

  @Get('find-many')
  findMany() {
    return this.service.findMany();
  }

  @Get('find-one/:userId')
  findOne(@Param('userId') userId: string) {
    return this.service.findOne(userId);
  }
}
