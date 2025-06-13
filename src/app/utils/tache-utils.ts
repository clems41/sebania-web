import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TacheUtils {
  getDureeFormatted(duree_minutes: number): string {
    const hours: number = Math.floor(duree_minutes/60);
    const minutes: number = duree_minutes%60;
    let result: string = `${hours}h`
    if (minutes > 0) {
      result += `${minutes}`;
    }
    return result;
  }
}
