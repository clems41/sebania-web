import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {Vocal} from '../models/vocal';
import {DateUtils} from '../utils/date-utils';

@Injectable({
  providedIn: 'root'
})
export class VocalService {
  private vocalPrefix = '/vocaux';

  constructor(private httpService: HttpService, private dateUtils: DateUtils) {
  }

  getInProgressForTache(date: Date): Observable<Vocal[]> {
    const params: HttpParams = new HttpParams()
      .set('origine', "taches")
      .set('date', this.dateUtils.toFrenchFormat(date));
    return this.httpService.get(`${this.vocalPrefix}/`, {params: params});
  }
}
