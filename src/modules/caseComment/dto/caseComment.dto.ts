import {ApiProperty} from '@nestjs/swagger';
import {FileDto} from 'src/modules/file/dto/file.dto';

export class CaseCommentDto {
  @ApiProperty({
    description: 'Case comment id',
    example: '52748b69-728b-4db9-8b69-37c759c63e70',
  })
  public id: string;

  @ApiProperty({
    description: 'Case comment tenant id',
    example: 110,
  })
  public tenantId: number;

  @ApiProperty({
    description: 'Case id',
    example: 'defface0-dd6f-4951-8229-e6c710067e95',
  })
  public caseId: string;

  @ApiProperty({
    description: 'Case comment created by user (userId)',
    example: '21fd328d-b8ed-4f51-bbac-499daf4271f3',
  })
  public userId?: string;

  @ApiProperty({
    description: 'Case comment value',
    example: 'Case comment',
  })
  public value: string;

  @ApiProperty({
    description: 'Case comment draft flag',
    example: true,
  })
  public isDraft?: boolean;

  @ApiProperty({
    description: 'Case comment files deleted flag',
    example: false,
  })
  public filesDeleted?: boolean;

  @ApiProperty({
    description: 'Name of the Info user that created the comment',
    example: 'Melodie King',
  })
  public userName: string;

  @ApiProperty({
    description: 'Case create date',
    example: '2021-02-22 22:56:41',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Case update date',
    example: '2021-02-22 22:56:41',
  })
  public updatedAt: Date;

  @ApiProperty({
    description: 'Case comment files',
    example: '',
  })
  public files?: FileDto[];
}
