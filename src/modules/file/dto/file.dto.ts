import {ApiProperty} from '@nestjs/swagger';
import {FileEntityName} from '../file.enum';

export class FileDto {
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
  public userId: string;

  @ApiProperty({
    description: 'File person id',
    example: '21fd328d-b8ed-4f51-bbac-499daf4271f3',
  })
  public personId?: string;

  @ApiProperty({
    description: 'File path and name',
    example: './case/066d02f2-22af-4b2b-ac7b-e78cfaa6b841/file/1620201232612_screenshot.PNG',
  })
  public filePathAndName?: string;

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
    description: 'Parent entity name',
    example: 'CaseComment',
  })
  public entityName: FileEntityName;

  @ApiProperty({
    description: 'External file id',
    example: 'ffe2f0db-1ad2-4bdd-b1a6-dcc1e69b31a4',
  })
  public externalId?: string;

  @ApiProperty({
    description: 'User Id who deleted file',
    example: 'ffe2f0db-1ad2-4bdd-b1a6-dcc1e69b31a4',
  })
  public deletedByUserId?: string;

  @ApiProperty({
    description: 'User name',
    example: 'ffe2f0db-1ad2-4bdd-b1a6-dcc1e69b31a4',
  })
  public userName?: string;

  @ApiProperty({
    description: 'File description',
    example: 'File description',
  })
  public description?: string;

  @ApiProperty({
    description: 'File create date',
    example: '2021-02-22 22:56:41',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'File update date',
    example: '2021-02-22 22:56:41',
  })
  public updatedAt: Date;
}
