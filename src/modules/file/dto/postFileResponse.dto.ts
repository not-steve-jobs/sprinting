import {ApiProperty} from '@nestjs/swagger';

export class PostFileResponseDto {
  @ApiProperty({
    description: 'File id',
    example: 'ffe2f0db-1ad2-4bdd-b1a6-dcc1e69b31a4',
  })
  public documentID: string;
}
