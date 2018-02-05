import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enterpriseScale'
})

export class EnterpriseScalePipe implements PipeTransform {
  transform(value: any): any {
    if (value == 1) return '50人以下';
    if (value == 2) return '50-100人';
    if (value == 3) return '100-200人';
    if (value == 4) return '200-500人';
    if (value == 5) return '500人以上';
    return ''
  }
}
