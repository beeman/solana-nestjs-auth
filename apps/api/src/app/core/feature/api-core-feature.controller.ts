import { Controller, Get } from '@nestjs/common';
import { ApiCoreDataAccessService } from '../data-access';

@Controller('core')
export class ApiCoreFeatureController {
  constructor(private readonly service: ApiCoreDataAccessService) {}

  @Get('uptime')
  uptime() {
    return this.service.uptime();
  }
}
