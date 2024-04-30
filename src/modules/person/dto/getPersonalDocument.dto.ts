import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class GetPersonalDocumentDto {
  @IsString()
  @ApiProperty({
    description: 'Document id',
    example: '1',
  })
  public id: string;

  @IsString()
  @ApiProperty({
    description: 'Person id',
    example: '1',
  })
  public personId: string;

  @IsString()
  @ApiProperty({
    description: 'Document type',
    example: 'type',
  })
  public documentType: string;

  @IsString()
  @ApiProperty({
    description: 'External document id',
    example: '1',
  })
  public externalDocId: string;

  @IsString()
  @ApiProperty({
    description: 'Document create date',
    example: '2021-02-23 14:17:36',
  })
  public createdAt: string;

  @IsString()
  @ApiProperty({
    description: 'Document update date',
    example: '2021-02-23 14:17:36',
  })
  public updatedAt: string;

  @IsString()
  @ApiProperty({
    description: 'Document URL',
    example: 'https://document',
  })
  public url: string;
}
