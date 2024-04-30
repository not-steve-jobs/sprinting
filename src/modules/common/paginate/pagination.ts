import {PaginationResult} from './paginationResult.interface';

export class Pagination<PaginationEntity> {
  public results: PaginationEntity[];
  public page_total: number;
  public total: number;

  constructor(paginationResults: PaginationResult<PaginationEntity>) {
    this.results = paginationResults.results;
    this.page_total = paginationResults.results.length;
    this.total = paginationResults.total;
  }
}
