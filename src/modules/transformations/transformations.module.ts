import {Module} from '@nestjs/common';
import {CoreModule} from '../../core/core.module';
import {TransformationsService} from './transformation.service';
import {TransformationsRepository} from './transformations.repository';

@Module({
  // FIXME: TransformationsRepository is not a Module and thus shouldn't be imported like this,
  //        but TypeOrmModule.forFeature([TransformationsRepository]) does not work (possibly because
  //        TransformationsRepository doesn't specify an entity?)
  //        Watch out for any odd consequences of this.
  imports: [CoreModule, TransformationsRepository],
  controllers: [],
  providers: [TransformationsService],
  exports: [TransformationsService],
})
export class TransformationsModule {}
