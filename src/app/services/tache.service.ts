import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {map, Observable} from 'rxjs';
import {Tache} from '../models/tache';
import {HttpParams} from '@angular/common/http';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private tachePrefix = '/taches';

  constructor(private httpService: HttpService) {
  }

  getAll(user_id: number, date: Date): Observable<Tache[]> {
    const params: HttpParams = new HttpParams()
      .set('user_id', user_id)
      .set('date', (moment(date)).format('DD/MM/YYYY'));
    return this.httpService.get(`${this.tachePrefix}/`, {params: params});
  }

  getTotalMinutesDay(user_id: number, date: Date): Observable<number> {
    const params: HttpParams = new HttpParams()
      .set('user_id', user_id)
      .set('date', (moment(date)).format('DD/MM/YYYY'));
    return this.httpService.get(`${this.tachePrefix}/total/`, {params: params})
      .pipe(
        map((response: any) => {
          return response.total_minutes;
        })
      );
  }
}
