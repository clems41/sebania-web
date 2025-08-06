import {Injectable} from '@angular/core';
import {StatutJour} from '../models/statut-jour';

@Injectable({
  providedIn: 'root'
})
export class TacheUtils {
  getDureeFormatted(duree_minutes: number, minutes_included: boolean = true): string {
    const hours: number = Math.floor(duree_minutes/60);
    const minutes: number = duree_minutes%60;
    let result: string = `${hours}h`
    if (!minutes_included) {
      return result;
    }
    if (minutes > 0) {
      result += `${minutes}`;
    }
    return result;
  }

  getStatutJourFromTotalMinutes(total_minutes: number): StatutJour {
    let statut = StatutJour.ok;
    if (total_minutes > 60*9) {
      statut = StatutJour.warning;
    }
    if (total_minutes > 60*10) {
      statut = StatutJour.danger;
    }
    return statut;
  }
}
