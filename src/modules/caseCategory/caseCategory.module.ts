import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {CaseCategoryRepository} from './caseCategory.repository';
import {CaseCategoryController} from './caseCategory.controller';
import {CaseCategoryService} from './caseCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaseCategoryRepository]), CoreModule],
  controllers: [CaseCategoryController],
  providers: [CaseCategoryService],
})
export class CaseCategoryModule {}
