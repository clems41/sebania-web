import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Observable, of} from 'rxjs';
import {DateUtils} from '../utils/date-utils';
import {VueEnsembleCards} from '../models/dashboard/vue-ensemble';
import {NiveauComplexite} from '../models/niveau-complexite';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private prefix = '/dashboards';
  private vueEnsembleSuffix = '/vue-ensemble';

  constructor(private httpService: HttpService, private dateUtils: DateUtils) {
  }

  getVueEnsembleCards(): Observable<VueEnsembleCards> {
    const mock: VueEnsembleCards = {
      temps_travail_mois_actuel_en_minutes: 20 * 60 * 8.9,
      temps_travail_mois_annee_precedente_en_minutes: 20 * 60 * 8.5,
      temps_travail_moyen_par_jour_en_minutes: 60 * 7.4,
      temps_travail_moyen_par_mois_en_minutes: 19 * 60 * 8.3,
      activite_chronophage: {
        id: 32,
        nom: 'Désherbage',
        categorie: '',
        mots_cles: '',
        niveau_complexite: NiveauComplexite.cultures,
        unites: []
      },
      culture_chronophage: {
        id: 12,
        nom: 'Carotte',
        categorie: 'racine'
      },
      poucentage_activite: 12,
      poucentage_culture: 35
    };
    return of(mock);
    // return this.httpService.get(`${this.prefix}/`);
  }
}
