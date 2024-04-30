import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {NetPromoteScoreRepository} from './netPromoteScore.repository';
import {NetPromoteScoreService} from './netPromoteScore.service';
import {NetPromoteScoreController} from './netPromoteScore.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NetPromoteScoreRepository]), CoreModule],
  controllers: [NetPromoteScoreController],
  providers: [NetPromoteScoreService],
  exports: [NetPromoteScoreService],
})
export class NetPromoteScoreModule {}
