import {IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

import {DisableUserOrigin} from '../user.enum';

export class DisableUserDto {
  @IsString()
  @ApiProperty({
    description: 'Disable reason',
    example: 'New Position',
  })
  disableReason: string;

  @ApiProperty({
    description: 'The Origin of the action',
    example: 'clp-user',
  })
  origin?: DisableUserOrigin;
}
