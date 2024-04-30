import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {JobOrderAssociateCaseController} from './jobOrderAssociateCase.controller';
import {JobOrderAssociateCaseRepository} from './jobOrderAssociateCase.repository';
import {JobOrderAssociateCaseService} from './jobOrderAssociateCase.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobOrderAssociateCaseRepository]), CoreModule],
  controllers: [JobOrderAssociateCaseController],
  providers: [JobOrderAssociateCaseService],
  exports: [JobOrderAssociateCaseService],
})
export class JobOrderAssociateCaseModule {}
