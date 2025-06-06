import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {MethodeAgricole} from '../models/methode-agricole';
import {TypeParcelle} from '../models/parcelle';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private configPrefix = '/configurations';

  constructor(private httpService: HttpService) { }

  getMethodesAgricoles(): Observable<MethodeAgricole[]> {
    return this.httpService.get(`${this.configPrefix}/methodes-agricoles/`);
  }

  getTypeParcelles(): Observable<TypeParcelle[]> {
    return this.httpService.get(`${this.configPrefix}/types-parcelle/`);
  }
}
