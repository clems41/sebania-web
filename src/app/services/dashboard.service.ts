import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Observable, of} from 'rxjs';
import {DateUtils} from '../utils/date-utils';
import {
  VueEnsembleCards,
  VueEnsembleRepartitionActivite,
  VueEnsembleRepartitionCulture, VueEnsembleRepartitionParcelle
} from '../models/dashboard/vue-ensemble';
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

  getVueEnsembleRepartitionActivite(): Observable<VueEnsembleRepartitionActivite> {
    const mock: VueEnsembleRepartitionActivite = {
      data: [
        {categorie_nom: 'Production', duree_minutes: 1200},
        {categorie_nom: 'Commercialisation', duree_minutes: 800},
        {categorie_nom: 'Secondaire', duree_minutes: 130},
        {categorie_nom: 'Administratif', duree_minutes: 200},
        {categorie_nom: 'Général', duree_minutes: 360}
      ]
    };
    return of(mock);
  }

  getVueEnsembleRepartitionCulture(): Observable<VueEnsembleRepartitionCulture> {
    const mock: VueEnsembleRepartitionCulture = {
      data: [
        {culture_nom: 'Radis', duree_minutes: 1200},
        {culture_nom: 'Carotte', duree_minutes: 800},
        {culture_nom: 'Tomate', duree_minutes: 130},
        {culture_nom: 'Ail', duree_minutes: 200},
        {culture_nom: 'Persil', duree_minutes: 360},
        {culture_nom: 'Brocoli', duree_minutes: 485},
        {culture_nom: 'Chou-fleur', duree_minutes: 365},
        {culture_nom: 'Pomme de terre', duree_minutes: 758},
        {culture_nom: 'Patate douce', duree_minutes: 456},
        {culture_nom: 'Courge musquée', duree_minutes: 985},
        {culture_nom: 'Concombre', duree_minutes: 378},
        {culture_nom: 'Poivron', duree_minutes: 854},
        {culture_nom: 'Aubergine', duree_minutes: 124},
        {culture_nom: 'Citrouille', duree_minutes: 12}
      ]
    };
    return of(mock);
  }

  getVueEnsembleRepartitionParcelle(): Observable<VueEnsembleRepartitionParcelle> {
    const mock: VueEnsembleRepartitionParcelle = {
      data: [
        {parcelle_nom: 'Ouest 1', duree_minutes: 412},
        {parcelle_nom: 'Ouest 2', duree_minutes: 796},
        {parcelle_nom: 'Ouest 3', duree_minutes: 785},
        {parcelle_nom: 'Ouest 4', duree_minutes: 45},
        {parcelle_nom: 'Nord 1', duree_minutes: 360},
        {parcelle_nom: 'Nord 2', duree_minutes: 785},
        {parcelle_nom: 'Nord 3', duree_minutes: 458},
        {parcelle_nom: 'Nord 4', duree_minutes: 415},
        {parcelle_nom: 'Sud 1', duree_minutes: 123},
        {parcelle_nom: 'Sud 2', duree_minutes: 526},
        {parcelle_nom: 'Sud 3', duree_minutes: 458},
        {parcelle_nom: 'Sud 4', duree_minutes: 857},
        {parcelle_nom: 'Est 1', duree_minutes: 452},
        {parcelle_nom: 'Est 2', duree_minutes: 365},
        {parcelle_nom: 'Est 3', duree_minutes: 456},
        {parcelle_nom: 'Est 4', duree_minutes: 987}
      ]
    };
    return of(mock);
  }
}
