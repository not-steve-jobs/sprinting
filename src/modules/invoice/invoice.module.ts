import {Module} from '@nestjs/common';
import {InvoiceController} from './invoice.controller';
import {InvoiceService} from './invoice.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {InvoiceRepository} from './invoice.repository';
import {CoreModule} from '../../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceRepository]), CoreModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
