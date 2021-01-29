import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitCommunicationFilter',
})
export class UnitCommunicationFilterPipe implements PipeTransform {
  transform(items: any[], checkedCommunication: boolean): any[] {
    if (!items) return [];

    return items.filter((item) => {
      let filter = checkedCommunication ? 1 : 0;
      return item.unit.communication === filter;
    });
  }
}
