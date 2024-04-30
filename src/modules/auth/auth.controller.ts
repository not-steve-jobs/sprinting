import {Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {AuthService} from './auth.service';
import {AuthDto} from './dto/auth.dto';
import {AzureIdpAuthGuard} from '../../core/auth/azureIdpAuth.guard';
import {RegisterUserRequestDto} from '../user/dto/registerUserRequest.dto';
import {UserDto} from '../user/dto/user.dto';
import {TenantId} from '../../core/tenantId.decorator';
import {GetAuthArtifacts} from '../../core/getAuthArtifacts.decorator';
import {AuthArtifacts} from '../../core/auth/authArtifacts.interface';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {ContextService} from 'src/core/context/context.service';

@ApiTags('Authorization')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly contextService: ContextService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for authorization after B2C authentication'})
  @Get('/tenant/:tenantId/user/:B2CId/auth')
  async auth(
    // Parameters kept for backward compatibility. They must be declared as variables to avoid breaking Swagger.
    // TODO: Remove parameters. This route should be simply /auth
    @Param('tenantId', ParseIntPipe) tenantId: number, // eslint-disable-line
    @Param('B2CId') b2cId: string, // eslint-disable-line
  ): Promise<AuthDto> {
    return this.authService.auth(
      this.contextService.tenantContext.tenant,
      this.contextService.tenantUserContext.tenantUser,
    );
  }

  @UseGuards(AzureIdpAuthGuard)
  @ApiOperation({summary: 'Handler for registering User'})
  @Post('/auth/register')
  async register(
    @TenantId() tenantId: number,
    @GetAuthArtifacts() artifacts: AuthArtifacts,
    @Body() payload: RegisterUserRequestDto,
  ): Promise<UserDto> {
    return this.authService.register(tenantId, {...artifacts, ...payload});
  }

  @UseGuards(AzureIdpAuthGuard)
  @ApiOperation({summary: 'Handler for creating invitations'})
  @Post('/auth/tenantUserInvitation/:id')
  public async activate(
    @TenantId() tenantId: number,
    @Param('id', ParseUUIDPipe) id: string,
    @GetAuthArtifacts() artifacts: AuthArtifacts,
  ): Promise<TenantUser> {
    return this.authService.activate(tenantId, id, artifacts);
  }
}
