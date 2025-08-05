import {Activite} from '../activite';
import {Culture} from '../culture';

export interface VueEnsembleCards {
  temps_travail_mois_actuel_en_minutes: number;
  temps_travail_mois_annee_precedente_en_minutes: number;
  temps_travail_moyen_par_jour_en_minutes: number;
  temps_travail_moyen_par_mois_en_minutes: number;
  poucentage_activite: number;
  poucentage_culture: number;
  activite_chronophage: Activite;
  culture_chronophage: Culture;
}
