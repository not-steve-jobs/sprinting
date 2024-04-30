import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from 'src/core/core.module';
import {CloseReasonArgumentsService} from './closeReasonArguments.service';
import {CloseReasonArgumentsRepository} from './closeReasonArguments.repository';
import {CloseReasonModule} from '../closeReason/closeReason.module';
import {PersonModule} from '../person/person.module';
import {UserProfileRepository} from '../userProfile/userProfile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CloseReasonArgumentsRepository, UserProfileRepository]),
    CoreModule,
    CloseReasonModule,
    forwardRef(() => PersonModule),
  ],
  controllers: [],
  providers: [CloseReasonArgumentsService],
  exports: [CloseReasonArgumentsService],
})
export class CloseReasonArgumentsModule {}
