import {ApiProperty} from '@nestjs/swagger';
import {PlainObject} from '../../common/common.dto';

export class JobContactDto {
  @ApiProperty({
    description: 'User id',
    example: 'c87d445b-9c08-404f-bd95-7f54b902e230',
  })
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Smith',
  })
  fullName: string;

  @ApiProperty({
    description: 'Permissions of user',
    example: '["staffingRequest", "billTo", "reportTo"]',
  })
  permissions: string[];

  constructor(obj: PlainObject) {
    this.id = obj.id;
    this.fullName = obj.fullName;
    this.permissions = obj.permissions;
  }
}
