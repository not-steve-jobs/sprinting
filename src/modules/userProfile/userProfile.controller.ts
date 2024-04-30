import {Controller, Get, Param, Body, Put, Post, ParseIntPipe, ParseUUIDPipe, Patch} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {UserProfileDto} from './dto/userProfile.dto';
import {UserProfileService} from './userProfile.service';
import {UpsertUserProfileDto} from './dto/upsertUserProfile.dto';
import {Auth} from '../../core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {PreferencesDto} from './dto/preferences.dto';
import {ContextService} from 'src/core/context/context.service';
import {UpdateUserProfileDto} from './dto/updateUserProfile.dto';
import {UserProfile} from './userProfile.entity';

@ApiTags('User Profile')
@Controller()
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly contextService: ContextService,
  ) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving User Profile'})
  @Get('/tenant/:tenantId/user/:userId/user-profile')
  async get(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserProfileDto> {
    return await this.userProfileService.get(tenantId, userId);
  }

  @Auth(AuthScopes.roleAdmin, AuthScopes.self)
  @ApiOperation({summary: 'Handler for updating User Profile'})
  @Put('/tenant/:tenantId/user/:userId/user-profile')
  async upsertUserProfile(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: UpsertUserProfileDto,
  ): Promise<any> {
    return this.userProfileService.upsert(tenantId, userId, body, this.contextService.tenantUserContext.tenantUser);
  }

  // NOTE: This code should probably be removed when #2909 tech debt task is implemented
  @Auth(AuthScopes.roleAdmin, AuthScopes.self)
  @ApiOperation({summary: 'Handler for updating User Profile'})
  @Patch('/tenant/:tenantId/user/:userId/update-user-profile')
  async updateUserProfile(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    return this.userProfileService.update(tenantId, userId, body, this.contextService.tenantUserContext.tenantUser);
  }

  @Auth(AuthScopes.roleAdmin, AuthScopes.self)
  @ApiOperation({summary: 'Save user preferences'})
  @Post('/tenant/:tenantId/user/:userId/user-profile/preferences')
  public async savePreferences(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: PreferencesDto,
  ): Promise<UserProfileDto> {
    return this.userProfileService.savePreferences(
      tenantId,
      userId,
      body,
      this.contextService.tenantUserContext.tenantUser,
    );
  }
}
