import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {Observable, of} from 'rxjs';
import {DateUtils} from '../utils/date-utils';
import {
  VueEnsembleCards, VueEnsembleEvolutionTempsTravail,
  VueEnsembleRepartitionActivite,
  VueEnsembleRepartitionCulture, VueEnsembleRepartitionParcelle
} from '../models/dashboard/vue-ensemble';
import {NiveauComplexite} from '../models/niveau-complexite';
import {TempsTravailCards, TempsTravailEvolution} from '../models/dashboard/temps-travail';
import moment from 'moment';

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

  getVueEnsembleEvolutionTempsTravail(): Observable<VueEnsembleEvolutionTempsTravail> {
    const mock: VueEnsembleEvolutionTempsTravail = {
      data: [
        {mois: 'Janvier', duree_minutes: 412, moyenne_duree_minutes: 425},
        {mois: 'Février', duree_minutes: 796, moyenne_duree_minutes: 785},
        {mois: 'Mars', duree_minutes: 785, moyenne_duree_minutes: 736},
        {mois: 'Avril', duree_minutes: 45, moyenne_duree_minutes: 42},
        {mois: 'Mai', duree_minutes: 360, moyenne_duree_minutes: 312},
        {mois: 'Juin', duree_minutes: 785, moyenne_duree_minutes: 741},
        {mois: 'Juillet', duree_minutes: 458, moyenne_duree_minutes: 496},
        {mois: 'Août', duree_minutes: 415, moyenne_duree_minutes: 396},
        {mois: 'Septembre', duree_minutes: 123, moyenne_duree_minutes: 112},
        {mois: 'Octobre', duree_minutes: 526, moyenne_duree_minutes: 569},
        {mois: 'Novembre', duree_minutes: 458, moyenne_duree_minutes: 410},
        {mois: 'Décembre', duree_minutes: 857, moyenne_duree_minutes: 865}
      ]
    };
    return of(mock);
  }

  getTempsTravailCards(dateDebut: Date, dateFin: Date, culture_id: number | undefined,
                       activite_id: number | undefined, parcelle_id: number | undefined): Observable<TempsTravailCards> {
    const mock: TempsTravailCards = {
      temps_total_minutes: 6498,
      temps_total_moyenne_minutes: 7986,
      activite_chronophage: {
        id: 0,
        nom: 'Travail du sol',
        categorie: '',
        mots_cles: '',
        niveau_complexite: NiveauComplexite.base,
        unites: []
      },
      activite_frequente: {
        id: 0,
        nom: 'Récolte',
        categorie: '',
        mots_cles: '',
        niveau_complexite: NiveauComplexite.base,
        unites: []
      },
      culture_chronophage: {
        id: 0,
        nom: 'Tomate',
        categorie: ''
      },
      culture_frequente: {
        id: 0,
        nom: 'Radis',
        categorie: ''
      },
      parcelle_chronophage: {
        id: 0,
        nom: 'Ouest 4',
        longueur: 0,
        largeur: 0,
        largeur_planche: 0,
        nombre_planches: 0,
        type: {
          id: 0,
          nom: ''
        },
        largeur_passe_pieds: 0,
        superficie: 0,
        superficie_cultivee: 0
      },
      parcelle_frequente: {
        id: 0,
        nom: 'Nord 3',
        longueur: 0,
        largeur: 0,
        largeur_planche: 0,
        nombre_planches: 0,
        type: {
          id: 0,
          nom: ''
        },
        largeur_passe_pieds: 0,
        superficie: 0,
        superficie_cultivee: 0
      },
    };
    return of(mock);
  }

  getTempsTravailEvolution(dateDebut: Date, dateFin: Date, culture_id: number | undefined,
                       activite_id: number | undefined, parcelle_id: number | undefined): Observable<TempsTravailEvolution> {
    const mock: TempsTravailEvolution = {
      data: [
        {
          date: moment().subtract(10, 'week').toDate(),
          total_minutes: 60*37,
          total_minutes_moyenne: 60*37.8
        },
        {
          date: moment().subtract(9, 'week').toDate(),
          total_minutes: 60*32,
          total_minutes_moyenne: 60*38.2
        },
        {
          date: moment().subtract(8, 'week').toDate(),
          total_minutes: 60*33,
          total_minutes_moyenne: 60*37.8
        },
        {
          date: moment().subtract(7, 'week').toDate(),
          total_minutes: 60*37,
          total_minutes_moyenne: 60*37.9
        },
        {
          date: moment().subtract(6, 'week').toDate(),
          total_minutes: 60*40,
          total_minutes_moyenne: 60*38.2
        },
        {
          date: moment().subtract(5, 'week').toDate(),
          total_minutes: 60*37,
          total_minutes_moyenne: 60*37.8
        },
        {
          date: moment().subtract(4, 'week').toDate(),
          total_minutes: 60*37,
          total_minutes_moyenne: 60*37.8
        },
        {
          date: moment().subtract(3, 'week').toDate(),
          total_minutes: 60*42,
          total_minutes_moyenne: 60*39.2
        },
        {
          date: moment().subtract(2, 'week').toDate(),
          total_minutes: 60*39.5,
          total_minutes_moyenne: 60*38.5
        },
        {
          date: moment().subtract(1, 'week').toDate(),
          total_minutes: 60*40,
          total_minutes_moyenne: 60*38.5
        }
      ],
    };
    return of(mock);
  }
}
