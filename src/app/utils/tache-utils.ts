import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TacheUtils {
  getDureeFormatted(duree_minutes: number): string {
    return `${Math.floor(duree_minutes/60)}h${duree_minutes%60}`;
  }
}
