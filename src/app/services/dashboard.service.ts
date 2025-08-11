import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {DateUtils} from '../utils/date-utils';
import {
  VueEnsembleCards
} from '../models/dashboard/vue-ensemble';
import {TempsTravailCards, TempsTravailEvolution} from '../models/dashboard/temps-travail';
import {RepartitionActivite, RepartitionCulture, RepartitionParcelle} from '../models/dashboard/global';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private prefix = '/dashboards';
  private vueEnsembleSuffix = '/vue-ensemble';
  private tempsTravailSuffix = '/temps-travail';
  private globalSuffix = '/global';

  constructor(private httpService: HttpService, private dateUtils: DateUtils) {
  }

  getVueEnsembleCards(): Observable<VueEnsembleCards> {
    return this.httpService.get(`${this.prefix}${this.vueEnsembleSuffix}/cards/`);
  }

  getRepartitionActivite(dateDebut: Date, dateFin: Date, culture_id: number | undefined,
                         activite_id: number | undefined, parcelle_id: number | undefined): Observable<RepartitionActivite> {
    return this.httpService.get(`${this.prefix}${this.globalSuffix}/activites/`, {params:
        this.getParams(dateDebut, dateFin, undefined, culture_id, activite_id, parcelle_id)});
  }

  getRepartitionCulture(dateDebut: Date, dateFin: Date, culture_id: number | undefined,
                        activite_id: number | undefined, parcelle_id: number | undefined): Observable<RepartitionCulture> {
    return this.httpService.get(`${this.prefix}${this.globalSuffix}/cultures/`, {params:
        this.getParams(dateDebut, dateFin, undefined, culture_id, activite_id, parcelle_id)});
  }

  getRepartitionParcelle(dateDebut: Date, dateFin: Date, culture_id: number | undefined,
                         activite_id: number | undefined, parcelle_id: number | undefined): Observable<RepartitionParcelle> {
    return this.httpService.get(`${this.prefix}${this.globalSuffix}/parcelles/`, {params:
        this.getParams(dateDebut, dateFin, undefined, culture_id, activite_id, parcelle_id)});
  }

  getTempsTravailCards(dateDebut: Date, dateFin: Date, culture_id: number | undefined,
                       activite_id: number | undefined, parcelle_id: number | undefined): Observable<TempsTravailCards> {
    return this.httpService.get(`${this.prefix}${this.tempsTravailSuffix}/cards/`, {params:
        this.getParams(dateDebut, dateFin, 'jour', culture_id, activite_id, parcelle_id)});
  }

  getTempsTravailEvolution(dateDebut: Date, dateFin: Date, periode: string, culture_id: number | undefined,
                           activite_id: number | undefined, parcelle_id: number | undefined): Observable<TempsTravailEvolution> {
    console.log('periode', periode);
    const params = this.getParams(dateDebut, dateFin, periode, culture_id, activite_id, parcelle_id)
    console.log('params', params);
    return this.httpService.get(`${this.prefix}${this.globalSuffix}/duree/`, {params: params}
        );
  }

  private getParams(dateDebut: Date, dateFin: Date, periode: string | undefined, culture_id: number | undefined,
                    activite_id: number | undefined, parcelle_id: number | undefined): HttpParams {
    let params: HttpParams = new HttpParams()
      .set('date_debut', this.dateUtils.toFrenchFormat(dateDebut))
      .set('date_fin', this.dateUtils.toFrenchFormat(dateFin));
    if (periode) {
      params = params.set("periode", periode);
    }
    if (culture_id) {
      params = params.set("culture_id", culture_id);
    }
    if (activite_id) {
      params = params.set("activite_id", activite_id);
    }
    if (parcelle_id) {
      params = params.set("parcelle_id", parcelle_id);
    }
    return params;
  }
}
