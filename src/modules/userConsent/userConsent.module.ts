import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserConsentRepository} from './userConsent.repository';
import {UserConsentService} from './userConsent.service';
import {UserConsentController} from './userConsent.controller';
import {ConsentModule} from '../consent/consent.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserConsentRepository]), CoreModule, ConsentModule],
  controllers: [UserConsentController],
  providers: [UserConsentService],
  exports: [UserConsentService],
})
export class UserConsentModule {}
