import {ApiProperty} from '@nestjs/swagger';

export class EnableUserDto {
  @ApiProperty({
    description: 'The ID of th Admin which enabled the User to the platform',
    example: '00000000-0000-4000-0000-000000001107',
  })
  enabledByUserId?: string;
}
