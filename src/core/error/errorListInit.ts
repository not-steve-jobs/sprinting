import {ErrorListMetadataKey} from './errorList.decorator';
import {ErrorListMetadata} from './errorList.interface';

export function ErrorListInit() {
  if (!Reflect.hasOwnMetadata(ErrorListMetadataKey, Object)) return;
  const errorListMetadata: ErrorListMetadata = Reflect.getOwnMetadata(ErrorListMetadataKey, Object);
  errorListMetadata.targets.forEach((target) => {
    target.initErrors();
  });
}
