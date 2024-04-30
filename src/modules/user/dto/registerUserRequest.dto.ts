import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsUUID} from 'class-validator';

export class RegisterUserRequestDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User innvitation id',
    example: '1480f8de-e688-4ff5-8e44-1059f0e97668',
  })
  invitationId: string;
}
