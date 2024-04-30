import {WarningListMetadata} from './warningList.interface';

export const WarningListMetadataKey = 'WarningList';

export function WarningList() {
  return (target: any) => {
    let errorListMetadata: WarningListMetadata;
    if (Reflect.hasOwnMetadata(WarningListMetadataKey, Object)) {
      errorListMetadata = Reflect.getOwnMetadata(WarningListMetadataKey, Object);
    } else {
      errorListMetadata = {targets: []};
      Reflect.defineMetadata(WarningListMetadataKey, errorListMetadata, Object);
    }
    errorListMetadata.targets.push(target);
  };
}
