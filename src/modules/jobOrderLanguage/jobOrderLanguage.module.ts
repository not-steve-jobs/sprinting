import {JobOrderLanguageService} from './jobOrderLanguage.service';
import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JobOrderLanguageRepository} from './jobOrderLanguage.repository';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([JobOrderLanguageRepository])],
  controllers: [],
  providers: [JobOrderLanguageService],
  exports: [JobOrderLanguageService],
})
export class JobOrderLanguageModule {}
