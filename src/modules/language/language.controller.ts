import {AuthScopes} from '../../core/auth/authScopes';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Controller, Get} from '@nestjs/common';
import {LanguageService} from './language.service';
import {LanguageDto} from './dto/language.dto';
import {Auth} from 'src/core/auth/auth.decorator';

@ApiTags('Language')
@Controller()
export class LanguageController {
  public constructor(private readonly languageService: LanguageService) {}

  @Auth(AuthScopes.roleUser)
  @ApiOperation({summary: 'Provide all available languages'})
  @Get('/language')
  public async getAll(): Promise<LanguageDto[]> {
    return this.languageService.getAll();
  }
}
