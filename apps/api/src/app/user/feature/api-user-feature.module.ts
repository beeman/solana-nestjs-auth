import { Module } from '@nestjs/common';
import { ApiUserDataAccessModule } from '../data-access';
import { ApiUserFeatureController } from './api-user-feature.controller';

@Module({
  controllers: [ApiUserFeatureController],
  imports: [ApiUserDataAccessModule],
})
export class ApiUserFeatureModule {}
