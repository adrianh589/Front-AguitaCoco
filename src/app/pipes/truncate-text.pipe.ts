import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, maxLength: number = 125): string {
    if (value.length >= maxLength) return `${value.substr(0, maxLength)}...`;
    return value;
  }
}
