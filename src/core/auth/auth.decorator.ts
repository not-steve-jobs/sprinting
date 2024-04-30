import {SetMetadata, applyDecorators, UseGuards} from '@nestjs/common';
import {AuthGuard} from './auth.guard';
import {ApiBearerAuth} from '@nestjs/swagger';
import {StoreAuthValues} from './storeAuthValues.decorator';

export const Auth = (...scopes: string[]) => {
  return applyDecorators(SetMetadata('scopes', scopes), StoreAuthValues(), UseGuards(AuthGuard), ApiBearerAuth());
};
