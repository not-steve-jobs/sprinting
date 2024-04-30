import {CoreModule} from 'src/core/core.module';
import {RedisService} from './redis.service';
import {Module} from '@nestjs/common';

@Module({
  imports: [CoreModule],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
