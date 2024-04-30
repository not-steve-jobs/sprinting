import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ClientRepository} from './client.repository';
import {CoreModule} from 'src/core/core.module';
import {ClientService} from './client.service';
import {DataProvidingModule} from '../integrations/dataProviding/dataProviding.module';

@Module({
  imports: [
    CoreModule, // required for auth decorator
    TypeOrmModule.forFeature([ClientRepository]),
    forwardRef(() => DataProvidingModule),
  ],
  providers: [ClientService],
  controllers: [],
  exports: [ClientService],
})
export class ClientModule {}
