import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit = 25,
    completeWords = false,
    ellipsis = '...',
  ) {
    if (completeWords) {
      let result = value || '';
      if (value) {
        const words = value.split(/\s+/);
        if (words.length > Math.abs(limit)) {
          if (limit < 0) {
            limit *= -1;
            result =
              ellipsis +
              words.slice(words.length - limit, words.length).join(' ');
          } else {
            result = words.slice(0, limit).join(' ') + ellipsis;
          }
        }
      }
      return result;
    }
    return value && value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}
