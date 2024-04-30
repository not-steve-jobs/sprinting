import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class UploadTenantDocumentDto {
  @IsString()
  @ApiProperty({
    description: 'External document id',
    example: '1',
  })
  public externalDocId: string;
}
