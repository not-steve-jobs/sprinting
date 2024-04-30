import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LanguageRepository} from './language.repository';
import {LanguageService} from './language.service';
import {LanguageController} from './language.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([LanguageRepository])],
  providers: [LanguageService],
  controllers: [LanguageController],
  exports: [LanguageService],
})
export class LanguageModule {}
