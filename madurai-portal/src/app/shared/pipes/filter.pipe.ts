import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchText: string, field: keyof T = 'name' as keyof T): T[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(item =>
      String(item[field]).toLowerCase().includes(searchText)
    );
  }
}
