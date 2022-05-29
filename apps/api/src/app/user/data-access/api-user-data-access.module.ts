import { Module } from '@nestjs/common';
import { ApiCoreDataAccessModule } from '../../core/data-access';
import { ApiUserDataAccessService } from './api-user-data-access.service';

@Module({
  providers: [ApiUserDataAccessService],
  exports: [ApiUserDataAccessService],
  imports: [ApiCoreDataAccessModule],
})
export class ApiUserDataAccessModule {}
