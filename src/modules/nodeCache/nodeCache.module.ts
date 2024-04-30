import {Module} from '@nestjs/common';
import {CoreModule} from 'src/core/core.module';
import {NodeCacheService} from './nodeCache.service';

@Module({
  imports: [CoreModule],
  controllers: [],
  providers: [NodeCacheService],
  exports: [NodeCacheService],
})
export class NodeCacheModule {}
