import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterText',
})
export class FilterTextPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter((item) => {
      let cadena = JSON.stringify(item).toLowerCase();
      let busqueda = searchText.toLowerCase();
      return cadena.includes(busqueda);
    });
  }
}
