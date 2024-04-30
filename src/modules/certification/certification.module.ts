import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CertificationRepository} from './certification.repository';
import {CertificationService} from './certification.service';
import {CertificationController} from './certification.controller';
import {AzureCognitiveSearchModule} from '../azureCognitiveSearch/azureCognitiveSearch.module';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([CertificationRepository]), AzureCognitiveSearchModule],
  controllers: [CertificationController],
  providers: [CertificationService],
  exports: [CertificationService],
})
export class CertificationModule {}
