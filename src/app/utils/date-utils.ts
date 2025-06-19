import {Injectable} from '@angular/core';
import moment from 'moment/moment';

@Injectable({
  providedIn: 'root'
})
export class DateUtils {
  toFrenchString(date: Date): string {
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    return `${date.getDate()} ${month} ${date.getFullYear()}`;
  }

  toFrenchFormat(date: Date): string {
    return (moment(date)).format('DD/MM/YYYY');
  }

  fromFrenchFormat(date: string): Date {
    return moment(date, 'DD/MM/YYYY').toDate();
  }

  addDays(date: Date, days: number): Date {
    return moment(date).add(days, 'days').toDate();
  }
}
