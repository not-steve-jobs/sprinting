import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ShiftRepository} from './shift.repository';
import {ShiftService} from './shift.service';
import {ShiftController} from './shift.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([ShiftRepository])],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService],
})
export class ShiftModule {}
