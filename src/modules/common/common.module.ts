import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {CommonController} from './common.controller';
import {CommonService} from './common.service';

@Module({
  imports: [CoreModule],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
