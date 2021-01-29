import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sectorActiveFilter'
})
export class SectorActiveFilterPipe implements PipeTransform {

  transform(items: any[], checkedActive: boolean): any[] {
    if (!items) return [];

    return items.filter((item) => {
      let filter = checkedActive ? 1 : 0;
      return item.active === filter;
    });
  }

}
