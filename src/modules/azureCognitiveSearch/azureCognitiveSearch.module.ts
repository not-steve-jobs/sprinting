import {HttpModule, Module} from '@nestjs/common';
import {CoreModule} from 'src/core/core.module';
import {AzureCognitiveSearchService} from './azureCognitiveSearch.service';

@Module({
  imports: [HttpModule, CoreModule],
  providers: [AzureCognitiveSearchService],
  exports: [AzureCognitiveSearchService],
})
export class AzureCognitiveSearchModule {}
