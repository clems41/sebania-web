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

  toFrenchStringSansJour(date: Date): string {
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    return `${month} ${date.getFullYear()}`;
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

  getFirstMondayOfMonth(date: moment.Moment): moment.Moment {
    // Clone pour ne pas muter l'objet original
    const firstDayOfMonth = date.clone().startOf('month');

    // Si le premier jour du mois est un lundi (1), on le retourne directement
    if (firstDayOfMonth.isoWeekday() === 1) {
      return firstDayOfMonth;
    }

    // Sinon, on avance jusqu'au prochain lundi
    return firstDayOfMonth.add(8 - firstDayOfMonth.isoWeekday(), 'days');
  }
}
