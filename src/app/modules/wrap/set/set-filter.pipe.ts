import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setFilter'
})
export class SetFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter((item) => {
      console.log(item);
      let cadena = JSON.stringify(item).toLowerCase();
      let busqueda = searchText.toLowerCase();
      return cadena.includes(busqueda);
    });
  }
}
