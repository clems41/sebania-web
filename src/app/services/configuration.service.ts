import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {MethodeAgricole} from '../models/methode-agricole';
import {TypeParcelle} from '../models/parcelle';
import {Activite} from '../models/activite';
import {Culture} from '../models/culture';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private configPrefix = '/configurations';

  constructor(private httpService: HttpService) { }

  getMethodesAgricoles(): Observable<MethodeAgricole[]> {
    return this.httpService.get(`${this.configPrefix}/methodes-agricoles/`, {needAuth: false});
  }

  getTypeParcelles(): Observable<TypeParcelle[]> {
    return this.httpService.get(`${this.configPrefix}/types-parcelle/`, {needAuth: false});
  }

  getActivites(): Observable<Activite[]> {
    return this.httpService.get(`${this.configPrefix}/activites/`, {needAuth: false});
  }

  getCultures(): Observable<Culture[]> {
    return this.httpService.get(`${this.configPrefix}/cultures/`, {needAuth: false});
  }
}
