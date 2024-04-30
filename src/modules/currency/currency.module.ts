import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CoreModule} from '../../core/core.module';
import {CurrencyRepository} from './currency.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRepository]), CoreModule],
  controllers: [],
  providers: [],
})
export class CurrencyModule {}
