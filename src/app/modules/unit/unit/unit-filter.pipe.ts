import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitFilter',
})
export class UnitFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter((item) => {
      let unit = item.unit;
      let cadena = JSON.stringify(unit).toLowerCase();
      let busqueda = searchText.toLowerCase();
      return cadena.includes(busqueda);
    });
  }
}
