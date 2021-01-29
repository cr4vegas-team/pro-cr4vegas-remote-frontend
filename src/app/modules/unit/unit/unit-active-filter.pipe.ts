import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitActiveFilter'
})
export class UnitActiveFilterPipe implements PipeTransform {

  transform(items: any[], checkedActive: boolean): any[] {
    if (!items) return [];

    return items.filter((item) => {
      let filter = checkedActive ? 1 : 0;
      return item.unit.active === filter;
    });
  }

}
