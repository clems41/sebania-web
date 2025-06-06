import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {Tache} from '../models/tache';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private tachePrefix = '/taches';

  constructor(private httpService: HttpService) { }

  getAll(user_id: number, date:Date): Observable<Tache[]> {
    const params: HttpParams = new HttpParams().set('user_id', user_id).set('date', date.toString());
    return this.httpService.get(`${this.tachePrefix}/`, params);
  }
}
