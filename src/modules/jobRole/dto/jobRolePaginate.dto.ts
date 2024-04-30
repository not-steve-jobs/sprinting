import {PaginationOptions} from '../../common/paginate';
import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, Min} from 'class-validator';
import {Type} from 'class-transformer';

export class JobRolePaginateDto implements PaginationOptions {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  itemsPerPage: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  page: number;
}
