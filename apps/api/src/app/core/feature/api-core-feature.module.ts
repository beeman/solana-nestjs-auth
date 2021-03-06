import { Module } from '@nestjs/common';
import { ApiAuthFeatureModule } from '../../auth/feature';
import { ApiUserFeatureModule } from '../../user/feature';
import { ApiCoreDataAccessModule } from '../data-access';
import { ApiCoreFeatureController } from './api-core-feature.controller';

const features = [
  // Add features here
  ApiAuthFeatureModule,
  ApiUserFeatureModule,
];

@Module({
  controllers: [ApiCoreFeatureController],
  imports: [ApiCoreDataAccessModule, ...features],
})
export class ApiCoreFeatureModule {}
