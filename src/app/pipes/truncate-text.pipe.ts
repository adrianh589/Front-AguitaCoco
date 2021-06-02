import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, maxLength: number = 125): string {
      
    return `${value.substr(0, maxLength)}...`;
  }
}
