import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20, trail: string = '...'): string {
    if (!value) return '';
    const plainText = value.replace(/<\/?[^>]+(>|$)/g, '');
    return plainText.length > limit
      ? plainText.substring(0, limit) + trail
      : plainText;
  }
}
