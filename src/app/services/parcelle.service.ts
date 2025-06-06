import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Parcelle} from '../models/parcelle';
import {Observable} from 'rxjs';
import {ParcelleRequest} from '../models/parcelle/parcelle-request';

@Injectable({
  providedIn: 'root'
})
export class ParcelleService {
  private parcellePrefix = '/parcelles';

  constructor(private httpService: HttpService) { }

  getAll(): Observable<Parcelle[]> {
    return this.httpService.get(`${this.parcellePrefix}/`);
  }

  create(request: ParcelleRequest): Observable<Parcelle> {
    return this.httpService.post(`${this.parcellePrefix}/`, request);
  }

  update(parcelle_id: number, request: ParcelleRequest): Observable<Parcelle> {
    return this.httpService.put(`${this.parcellePrefix}/${parcelle_id}/`, request);
  }

  delete(parcelle_id: number): Observable<null> {
    return this.httpService.delete(`${this.parcellePrefix}/${parcelle_id}/`);
  }
}
