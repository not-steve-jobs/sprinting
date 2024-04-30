import {ApiProperty} from '@nestjs/swagger';

export class CreateCaseCommentDto {
  @ApiProperty({
    description: 'Case comment id',
    example: '52748b69-728b-4db9-8b69-37c759c63e70',
  })
  public id?: string;

  @ApiProperty({
    description: 'Case id',
    example: 'defface0-dd6f-4951-8229-e6c710067e95',
  })
  public caseId: string;

  @ApiProperty({
    description: 'Case comment created by tenantUser',
    example: '21fd328d-b8ed-4f51-bbac-499daf4271f3',
  })
  public createdBy?: string;

  @ApiProperty({
    description: 'Name of the Info user that created the comment',
    example: 'Melodie King',
  })
  public userName?: string;

  @ApiProperty({
    description: 'Case comment value',
    example: 'Case comment',
  })
  public value?: string;
}
