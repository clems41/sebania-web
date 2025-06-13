import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import moment from 'moment/moment';
import {Vocal} from '../models/vocal';

@Injectable({
  providedIn: 'root'
})
export class VocalService {
  private vocalPrefix = '/vocaux';

  constructor(private httpService: HttpService) {
  }

  getInProgressForTache(date: Date): Observable<Vocal[]> {
    const params: HttpParams = new HttpParams()
      .set('origine', "taches")
      .set('date', (moment(date)).format('DD/MM/YYYY'));
    return this.httpService.get(`${this.vocalPrefix}/`, {params: params});
  }
}
