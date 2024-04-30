import {PipeTransform} from '@nestjs/common';
import {sanitize, sanitizeAll} from 'src/core/sanitization/htmlSanitizer';

/*
Usage:
  @UsePipes(new HtmlSanitizationPipe(['htmlField1', 'htmlField2', ...]))
  @UsePipes(new HtmlSanitizationPipe())
  @UsePipes(HtmlSanitizationPipe)
*/
export class HtmlSanitizationPipe implements PipeTransform {
  constructor(private fields?: string[]) {}

  async transform(value: any) {
    return this.fields ? sanitize(value, this.fields) : sanitizeAll(value);
  }
}
