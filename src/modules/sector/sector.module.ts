import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SectorRepository} from './sector.repository';
import {SectorService} from './sector.service';
import {SectorController} from './sector.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([SectorRepository])],
  controllers: [SectorController],
  providers: [SectorService],
  exports: [SectorService],
})
export class SectorModule {}
