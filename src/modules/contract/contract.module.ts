import {Module} from '@nestjs/common';
import {ContractController} from './contract.controller';
import {ContractService} from './contract.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ContractRepository} from './contract.repository';
import {CoreModule} from '../../core/core.module';
import {UserModule} from '../user/user.module';
import {BackgroundNotificationModule} from '../sendBackgroundNotification/backgroundNotification/backgroundNotification.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContractRepository]), CoreModule, UserModule, BackgroundNotificationModule],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
