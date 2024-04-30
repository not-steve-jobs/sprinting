import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AvailableWorkersRepository} from './availableWorkers.repository';
import {AvailableWorkersService} from './availableWorkers.service';
import {AvailableWorkersController} from './availableWorkers.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([AvailableWorkersRepository])],
  controllers: [AvailableWorkersController],
  providers: [AvailableWorkersService],
})
export class AvailableWorkersModule {}
