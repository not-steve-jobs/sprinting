import {ApiProperty} from '@nestjs/swagger';
import {PlainObject} from 'src/modules/common/common.dto';

export class createCaseDto {
  @ApiProperty({
    description: 'Case entity id',
    example: '00000000-0000-4000-0000-000000001162',
  })
  public entityId?: string;

  @ApiProperty({
    description: 'Case tenant id',
    example: 110,
  })
  public tenantId: number;

  @ApiProperty({
    description: 'Case entity name',
    example: 'staffingRequests',
  })
  public entityName: string;

  @ApiProperty({
    description: 'Case description',
    example: 'I had an issue with filling out the form.',
  })
  public description: string;

  @ApiProperty({
    description: 'Case subject',
    example: 'I had a problem...',
  })
  public subject: string;

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
  public caseCategoryId: number;

  @ApiProperty({
    description: 'Case created by',
    example: '00000000-0000-4000-0000-000000000027',
  })
  public createdBy: string;

  @ApiProperty({
    description: 'Additional properties in this object',
  })
  public additionalProperties?: PlainObject;
}
