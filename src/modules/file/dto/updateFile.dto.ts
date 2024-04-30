import {ApiProperty} from '@nestjs/swagger';
import {FileEntityName} from '../file.enum';

export class UpdateFileDto {
  @ApiProperty({
    description: 'File id',
    example: 'ffe2f0db-1ad2-4bdd-b1a6-dcc1e69b31a4',
  })
  public id: string;

  @ApiProperty({
    description: 'File tenant id',
    example: 110,
  })
  public tenantId: number;

  @ApiProperty({
    description: 'File user id',
    example: '21fd328d-b8ed-4f51-bbac-499daf4271f3',
  })
  public userId?: string;

  @ApiProperty({
    description: 'File path and name',
    example: 'screenshot.PNG',
  })
  public fileName: string;

  @ApiProperty({
    description: 'Parent entity id',
    example: 'a2da98f1-dfbe-4e9b-9112-72e59e654434',
  })
  public entityId?: string;

  @ApiProperty({
    description: 'Person id',
    example: 'a2da98f1-dfbe-4e9b-9112-72e59e654434',
  })
  public personId?: string;

  @ApiProperty({
    description: 'File description',
    example: 'File description',
  })
  public description?: string;

  @ApiProperty({
    description: 'Parent entity name',
    example: 'Case',
  })
  public entityName: FileEntityName;

  @ApiProperty({
    description: 'External id',
    example: '00000000-0000-4000-0000-000000001163',
  })
  public externalId?: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Smith',
  })
  public userName?: string;

  @ApiProperty({
    description: 'File create date',
    example: '2021-02-22 22:56:41',
  })
  public createdAt?: Date;
}
