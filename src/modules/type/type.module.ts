import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {TypeRepository} from './type.repository';
import {TypeController} from './type.controller';
import {TypeService} from './type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TypeRepository]), CoreModule],
  controllers: [TypeController],
  providers: [TypeService],
})
export class TypeModule {}
