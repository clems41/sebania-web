import {Injectable} from '@angular/core';
import {Ferme} from '../models/ferme';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {FermeRequest} from '../models/ferme/ferme-request';
import {EmployeRequest} from '../models/ferme/employe-request';
import {Activite} from '../models/activite';
import {Culture} from '../models/culture';
import {UpdateCultureRequest} from '../models/ferme/culture-request';

@Injectable({
  providedIn: 'root'
})
export class FermeService {
  private fermePrefix = '/fermes';

  constructor(private httpService: HttpService) {
  }

  getFerme(): Observable<Ferme> {
    return this.httpService.get(`${this.fermePrefix}/details/`);
  }

  update(request: FermeRequest): Observable<Ferme> {
    return this.httpService.put(`${this.fermePrefix}/update/`, request);
  }

  addEmploye(request: EmployeRequest): Observable<Ferme> {
    return this.httpService.post(`${this.fermePrefix}/employes/`, request);
  }

  deleteEmploye(employe_id: number): Observable<null> {
    return this.httpService.delete(`${this.fermePrefix}/employes/${employe_id}/`);
  }

  getCustomActivites(): Observable<Activite[]> {
    return this.httpService.get(`${this.fermePrefix}/activites/`);
  }

  getCustomCultures(): Observable<Culture[]> {
    return this.httpService.get(`${this.fermePrefix}/cultures/`);
  }

  updateCustomCultures(request: UpdateCultureRequest): Observable<Culture[]> {
    return this.httpService.put(`${this.fermePrefix}/cultures/`, request);
  }
}
