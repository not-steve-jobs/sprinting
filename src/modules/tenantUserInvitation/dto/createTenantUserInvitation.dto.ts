import {ApiProperty} from '@nestjs/swagger';

export class CreateTenantUserInvitationDto {
  @ApiProperty({
    description: 'The ID of the admin which invited the user',
    example: 'invitedByUserId',
  })
  public invitedByUserId?: string;
}
