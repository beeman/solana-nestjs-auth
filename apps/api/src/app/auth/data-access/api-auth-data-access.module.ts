import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiCoreDataAccessModule } from '../../core/data-access';
import { ApiAuthDataAccessService } from './api-auth-data-access.service';
import { JwtStrategy, LocalStrategy } from './strategies';
import { SolanaStrategy } from './strategies/solana.strategy';

@Module({
  providers: [
    ApiAuthDataAccessService,
    JwtStrategy,
    LocalStrategy,
    SolanaStrategy,
  ],
  exports: [ApiAuthDataAccessService],
  imports: [
    ApiCoreDataAccessModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
    }),
  ],
})
export class ApiAuthDataAccessModule {}
