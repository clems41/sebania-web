import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartUtils {
  getRandomColors(nb_colors: number): string[] {
    const letters = '0123456789ABCDEF';
    let result: string[] = [];
    for (let i = 0; i < nb_colors; i++) {
      let color = '#';
      for (var j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      result.push(color);
    }
    return result;
  }
}
