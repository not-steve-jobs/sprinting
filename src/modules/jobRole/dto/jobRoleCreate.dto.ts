import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class JobRoleCreateDto {
  @IsString()
  @ApiProperty({
    description: 'Job role name',
    example: 'Housekeeper',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Job role key name',
    example: 'housekeeper',
  })
  public keyName: string;
}
