import {ApiProperty} from '@nestjs/swagger';
import {Client} from '../client.entity';

export class ClientDto {
  @ApiProperty({
    description: 'Client id',
    example: '00000000-0000-4000-0000-000000000001',
  })
  id: string;

  @ApiProperty({
    description: 'Client country ID',
    example: 'b55b3f46-a784-4ff9-b053-b3193d191634',
  })
  countryId: string;

  @ApiProperty({
    description: 'Client name',
    example: 'Coca Cola - LU',
  })
  name: string;

  @ApiProperty({
    description: 'Client create date',
    example: '2021-02-02 12:32:00',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Client update date',
    example: '2021-02-02 12:32:00',
  })
  updatedAt: Date;

  constructor(obj: Client) {
    this.id = obj.id;
    this.countryId = obj.countryId;
    this.name = obj.name;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
