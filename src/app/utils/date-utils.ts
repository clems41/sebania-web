import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtils {
  toFrenchString(date: Date): string {
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    return `${date.getDate()} ${month} ${date.getFullYear()}`;
  }
}
