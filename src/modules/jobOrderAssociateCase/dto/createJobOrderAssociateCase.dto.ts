import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsUUID} from 'class-validator';

export class CreateJobOrderAssociateCaseDto {
  @IsNumber()
  @ApiProperty({
    description: 'Job Order Associate tenant ID',
    example: 137,
  })
  public tenantId: number;

  @IsUUID()
  @ApiProperty({
    description: 'Job Order Associate Candidate ID',
    example: '00000000-0000-4000-0000-000000001162',
  })
  public userId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Job Order Associate Job Order ID',
    example: '00000000-0000-4000-0000-000000001162',
  })
  public jobOrderId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Job Order Associate Case ID',
    example: '00000000-0000-4000-0000-000000001162',
  })
  public caseId: string;
}
