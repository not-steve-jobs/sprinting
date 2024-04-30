import {forwardRef, Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BranchRepository} from './branch.repository';
import {BranchService} from './branch.service';
import {BranchController} from './branch.controller';
import {DataProvidingModule} from '../integrations/dataProviding/dataProviding.module';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([BranchRepository]), forwardRef(() => DataProvidingModule)],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
