import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {map, Observable} from 'rxjs';
import {Tache} from '../models/tache';
import {HttpParams} from '@angular/common/http';
import {PatchTacheRequest, TacheRequest} from '../models/tache/tache-request';
import {DateUtils} from '../utils/date-utils';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private tachePrefix = '/taches';

  constructor(private httpService: HttpService, private dateUtils: DateUtils) {
  }

  getAll(user_id: number, date: Date): Observable<Tache[]> {
    const params: HttpParams = new HttpParams()
      .set('user_id', user_id)
      .set('date', this.dateUtils.toFrenchFormat(date));
    return this.httpService.get(`${this.tachePrefix}/`, {params: params});
  }

  create(request: TacheRequest): Observable<Tache> {
    return this.httpService.post(`${this.tachePrefix}/`, request);
  }

  update(tache_id: number, request: TacheRequest): Observable<Tache> {
    return this.httpService.put(`${this.tachePrefix}/${tache_id}/`, request);
  }

  patch(tache_id: number, request: PatchTacheRequest): Observable<Tache> {
    return this.httpService.patch(`${this.tachePrefix}/${tache_id}/`, request);
  }

  get(tache_id: number): Observable<Tache> {
    return this.httpService.get(`${this.tachePrefix}/${tache_id}/`);
  }

  delete(tache_id: number): Observable<null> {
    return this.httpService.delete(`${this.tachePrefix}/${tache_id}/`);
  }

  getTotalMinutesDay(user_id: number, date: Date): Observable<number> {
    const params: HttpParams = new HttpParams()
      .set('user_id', user_id)
      .set('date', this.dateUtils.toFrenchFormat(date));
    return this.httpService.get(`${this.tachePrefix}/total/`, {params: params})
      .pipe(
        map((response: any) => {
          return response.total_minutes;
        })
      );
  }
}
