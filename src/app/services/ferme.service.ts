import {Injectable} from '@angular/core';
import {Ferme} from '../models/ferme';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {FermeRequest} from '../models/ferme/ferme-request';
import {EmployeRequest} from '../models/ferme/employe-request';

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

  update(query: FermeRequest): Observable<Ferme> {
    return this.httpService.put(`${this.fermePrefix}/update/`, query);
  }

  addEmploye(query: EmployeRequest): Observable<Ferme> {
    return this.httpService.post(`${this.fermePrefix}/employes/`, query);
  }

  deleteEmploye(employe_id: number): Observable<null> {
    return this.httpService.delete(`${this.fermePrefix}/employes/${employe_id}/`);
  }
}
