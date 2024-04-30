import {ApiProperty} from '@nestjs/swagger';
import {FileDto} from './file.dto';

export class GetFilesDto {
  @ApiProperty({
    description: 'Files array',
  })
  public results: FileDto[];

  @ApiProperty({
    description: 'Files count',
    example: 2,
  })
  public total: number;
}
