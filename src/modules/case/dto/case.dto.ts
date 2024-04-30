import {ApiProperty} from '@nestjs/swagger';
import {IsOptional} from 'class-validator';
import {PlainObject} from 'src/modules/common/common.dto';
import {Case} from '../case.entity';

export class CaseDto {
  @ApiProperty({
    description: 'Case id',
    example: '00000000-0000-4000-0000-000000001163',
  })
  public id: string;

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

  @IsOptional()
  @ApiProperty({
    description: 'Case location object',
  })
  public location?: PlainObject;

  @ApiProperty({
    description: 'Case location id',
    example: 'I had a problem...',
  })
  public locationId?: string;

  @ApiProperty({
    description: 'Case status id',
    example: 29,
  })
  public statusId: number;

  @ApiProperty({
    description: 'Case category id',
    example: 1,
  })
  public caseCategoryId: number;

  @ApiProperty({
    description: 'Case created by',
    example: '00000000-0000-4000-0000-000000000027',
  })
  public userId: string;

  @ApiProperty({
    description: 'Location create date',
    example: '2021-02-02 12:32:00',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Location update date',
    example: '2021-02-02 12:32:00',
  })
  public updatedAt: Date;

  constructor(obj: Case) {
    this.id = obj.id;
    this.entityId = obj.entityId;
    this.tenantId = obj.tenantId;
    this.userId = obj.userId;
    this.entityName = obj.entityName;
    this.description = obj.description;
    this.subject = obj.subject;
    this.location = obj.location;
    this.locationId = obj.locationId;
    this.statusId = obj.statusId;
    this.caseCategoryId = obj.caseCategoryId;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
