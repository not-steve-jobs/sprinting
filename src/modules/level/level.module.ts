import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LevelRepository} from './level.repository';
import {LevelService} from './level.service';
import {LevelController} from './level.controller';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([LevelRepository])],
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelModule {}
