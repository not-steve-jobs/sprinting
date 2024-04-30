import {WarningListMetadataKey} from './warningList.decorator';
import {WarningListMetadata} from './warningList.interface';

export function WarningListInit() {
  if (!Reflect.hasOwnMetadata(WarningListMetadataKey, Object)) return;
  const errorListMetadata: WarningListMetadata = Reflect.getOwnMetadata(WarningListMetadataKey, Object);
  errorListMetadata.targets.forEach((target) => {
    target.initWarnings();
  });
}
