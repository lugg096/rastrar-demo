import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adrx'
})
export class AdrxPipe implements PipeTransform {

  transform(text: string, acount) {
    return text.substr(0, acount) + ' ... ' + text.substr(text.length - acount, text.length);
  }

}
