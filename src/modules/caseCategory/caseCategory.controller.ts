import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {Controller, Get, Param} from '@nestjs/common';
import {CaseCategoryService} from './caseCategory.service';
import {Auth} from 'src/core/auth/auth.decorator';
import {AuthScopes} from '../../core/auth/authScopes';
import {CaseCategory} from './caseCategory.entity';
import {CaseCategoryDto} from './dto/caseCategory.dto';

@ApiTags('Case Category')
@Controller()
export class CaseCategoryController {
  public constructor(private readonly service: CaseCategoryService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving case categories'})
  @Get('/case-categories')
  public async getAll(): Promise<CaseCategoryDto[]> {
    return this.service.getAll();
  }

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Handler for retrieving case category by name'})
  @Get('/case-category/name/:name')
  public async getOneByName(@Param('name') name: string): Promise<CaseCategory> {
    return this.service.findOneByName(name);
  }
}
