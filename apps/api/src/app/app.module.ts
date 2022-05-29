import { Module } from '@nestjs/common';

import { ApiCoreFeatureModule } from './core/feature';

@Module({
  imports: [ApiCoreFeatureModule],
})
export class AppModule {}
