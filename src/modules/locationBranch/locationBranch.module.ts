import {LocationBranchController} from './locationBranch.controller';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {LocationBranchRepository} from './locationBranch.repository';
import {LocationBranchService} from './locationBranch.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationBranchRepository]), CoreModule],
  controllers: [LocationBranchController],
  providers: [LocationBranchService],
  exports: [LocationBranchService],
})
export class LocationBranchModule {}
