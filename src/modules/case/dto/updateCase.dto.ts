import {ApiProperty} from '@nestjs/swagger';

export class UpdateCaseDto {
  @ApiProperty({
    description: 'Case entity name',
    example: 'staffingRequests',
  })
  public entityName?: string;

  @ApiProperty({
    description: 'Case description',
    example: 'I had an issue with filling out the form.',
  })
  public description?: string;

  @ApiProperty({
    description: 'Case subject',
    example: 'I had a problem...',
  })
  public subject?: string;

  @ApiProperty({
    description: 'Case location id',
    example: 'I had a problem...',
  })
  public locationId?: string;

  @ApiProperty({
    description: 'Case status id',
    example: 29,
  })
  public statusId?: number;

  @ApiProperty({
    description: 'Case category id',
    example: 1,
  })
  public caseCategoryId?: number;

  @ApiProperty({
    description: 'Case created by',
    example: '00000000-0000-4000-0000-000000000027',
  })
  public createdBy?: string;
}
