import { Module } from '@nestjs/common';
import { ApiAuthDataAccessModule } from '../data-access';
import { ApiAuthFeatureController } from './api-auth-feature.controller';

@Module({
  controllers: [ApiAuthFeatureController],
  imports: [ApiAuthDataAccessModule],
})
export class ApiAuthFeatureModule {}
