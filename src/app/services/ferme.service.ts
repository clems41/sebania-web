import {Injectable} from '@angular/core';
import {Ferme} from '../models/ferme';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FermeService {
  private fermePrefix = '/fermes';

  constructor(private httpService: HttpService) {
  }

  getFerme(): Observable<Ferme> {
    return this.httpService.get<Ferme>(`${this.fermePrefix}/details/`);
  }
}
