import {Controller, Param, Body, Post, Put, ParseIntPipe, Patch, ParseUUIDPipe, Get} from '@nestjs/common';
import {UserService} from './user.service';
import {UserDto} from './dto/user.dto';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {CreateUserDto} from './dto/createUser.dto';
import {UpdateUserDto} from './dto/updateUser.dto';
import {SimpleUserDto} from './dto/simpleUser.dto';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {FilterDto, ListingDto} from '../common/listing.dto';
import {TenantUser} from '../tenantUser/tenantUser.entity';
import {DisableUserDto} from './dto/disableUser.dto';
import {TenantUserInvitationDto} from '../tenantUserInvitation/dto/tenantUserInvitation.dto';
import {EnableUserDto} from './dto/enableUserDto';
import {ContextService} from 'src/core/context/context.service';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService, private readonly contextService: ContextService) {}

  @Auth(AuthScopes.roleAdmin)
  @ApiOperation({summary: 'Handler for creating User'})
  @Post('/tenant/:tenantId/user/create')
  async create(@Param('tenantId', ParseIntPipe) tenantId: number, @Body() payload: CreateUserDto): Promise<UserDto> {
    return this.userService.create(tenantId, payload);
  }

  @Auth(AuthScopes.roleAdmin)
  @ApiOperation({summary: 'Handler for updating User with permissions and locations'})
  @Patch('/tenant/:tenantId/user/:userId')
  async update(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() payload: UpdateUserDto,
  ): Promise<TenantUser> {
    return this.userService.update(tenantId, userId, payload);
  }

  @Auth(AuthScopes.roleAdmin, AuthScopes.self)
  @ApiOperation({summary: 'Handler for disabling User'})
  @Patch('/tenant/:tenantId/user/:userId/disable')
  async disable(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: DisableUserDto,
  ): Promise<TenantUser> {
    return this.userService.disable(tenantId, userId, body);
  }

  @Auth(AuthScopes.roleAdmin)
  @ApiOperation({summary: 'Handler for enabling User'})
  @Patch('/tenant/:tenantId/user/:userId/enable')
  async enable(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: EnableUserDto,
  ): Promise<TenantUserInvitationDto> {
    return this.userService.enable(tenantId, userId, body);
  }

  @Auth(AuthScopes.roleAdmin, AuthScopes.self)
  @ApiOperation({summary: 'Handler for updating some User properties'})
  @Put('/user/:userId')
  async upsert(@Param('userId', ParseUUIDPipe) userId: string, @Body() body: SimpleUserDto): Promise<UserDto> {
    return this.userService.upsert(userId, body);
  }

  @Auth(AuthScopes.roleUser)
  @Post('/tenant/:tenantId/user/:userId/my-colleagues')
  @ApiOperation({summary: 'Handler for User listing, sorting and filtering'})
  public async fetch(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() payload: ListingDto,
  ): Promise<any> {
    return this.userService.fetchMyColleagues(
      tenantId,
      userId,
      {page: payload.page, itemsPerPage: payload.itemsPerPage},
      {sort: payload.sort},
      {filter: payload.filter},
      this.contextService.tenantUserContext.tenantUser,
    );
  }

  @Auth(AuthScopes.roleUser)
  @Post('/tenant/:tenantId/user/:userId/my-colleagues-status')
  @ApiOperation({summary: 'Handler for User listing, aggregated by status'})
  public async groupByStatus(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() filter: FilterDto,
  ): Promise<any> {
    return this.userService.groupMyColleaguesByStatus(tenantId, userId, {filter: filter});
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all Users (distinct) first and last names'})
  @Get('/clientId/:clientId/user')
  public async fetchAllUsersFirstAndLastNames(@Param('clientId', ParseUUIDPipe) clientId: string): Promise<any[]> {
    return this.userService.fetchAllUsersFirstAndLastNames(clientId);
  }
}
