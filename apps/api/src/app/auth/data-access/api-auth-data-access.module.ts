import { Module } from '@nestjs/common';
import { ApiAuthDataAccessService } from './api-auth-data-access.service';

@Module({
  providers: [ApiAuthDataAccessService],
  exports: [ApiAuthDataAccessService],
})
export class ApiAuthDataAccessModule {}
