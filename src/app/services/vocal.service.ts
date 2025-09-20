import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {Vocal, VocalType} from '../models/vocal';
import {DateUtils} from '../utils/date-utils';

@Injectable({
  providedIn: 'root'
})
export class VocalService {
  private vocalPrefix = '/vocaux';

  constructor(private httpService: HttpService, private dateUtils: DateUtils) {
  }

  sendVocal(audio: Blob, vocalType: VocalType, date?: Date): Observable<Vocal> {
    let formData = new FormData();
    formData.append("file", audio);
    if (vocalType === VocalType.Taches) {
      return this.httpService.post(`${this.vocalPrefix}/taches/date/${this.dateUtils.toPathParameterFormat(date ?? new Date())}/`, formData);
    } else {
      return this.httpService.post(`${this.vocalPrefix}/parcelles/`, formData);
    }
  }

  getInProgressForTache(date: Date): Observable<Vocal[]> {
    const params: HttpParams = new HttpParams()
      .set('origine', "taches")
      .set('date', this.dateUtils.toFrenchFormat(date));
    return this.httpService.get(`${this.vocalPrefix}/`, {params: params});
  }
}
