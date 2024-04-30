import {ErrorListMetadata} from './errorList.interface';

export const ErrorListMetadataKey = 'ErrorList';

export function ErrorList() {
  return (target: any) => {
    let errorListMetadata: ErrorListMetadata;
    if (Reflect.hasOwnMetadata(ErrorListMetadataKey, Object)) {
      errorListMetadata = Reflect.getOwnMetadata(ErrorListMetadataKey, Object);
    } else {
      errorListMetadata = {targets: []};
      Reflect.defineMetadata(ErrorListMetadataKey, errorListMetadata, Object);
    }
    errorListMetadata.targets.push(target);
  };
}
