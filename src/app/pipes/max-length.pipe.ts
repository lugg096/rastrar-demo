import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength'
})
export class MaxLengthPipe implements PipeTransform {

  transform(text: string, count?) {
 /*    if (count) return text.substr(0, count) + '...';
    if (text.length > 10) return text.substr(0, 10) + '...';
    else return text; */
    if (count) return text.substr(0, count) + '...';
    if (text.length >= count) return text;
    else return text.substr(0, count) + '...';
  }

}
