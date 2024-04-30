import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class GetTenantDocumentDto {
  @IsString()
  @ApiProperty({
    description: 'External document id',
    example: '1',
  })
  public externalDocId: string;

  @IsString()
  @ApiProperty({
    description: 'Document URL',
    example: 'https://document',
  })
  public url: string;
}
