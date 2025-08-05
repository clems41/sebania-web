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

export interface VueEnsembleRepartitionActivite {
  data: VueEnsembleRepartitionActiviteItem[];
}

export interface VueEnsembleRepartitionActiviteItem {
  categorie_nom: string;
  duree_minutes: number;
}

export interface VueEnsembleRepartitionCulture {
  data: VueEnsembleRepartitionCultureItem[];
}

export interface VueEnsembleRepartitionCultureItem {
  culture_nom: string;
  duree_minutes: number;
}

export interface VueEnsembleRepartitionParcelle {
  data: VueEnsembleRepartitionParcelleItem[];
}

export interface VueEnsembleRepartitionParcelleItem {
  parcelle_nom: string;
  duree_minutes: number;
}

export interface VueEnsembleEvolutionTempsTravail {
  data: VueEnsembleEvolutionTempsTravailItem[];
}

export interface VueEnsembleEvolutionTempsTravailItem {
  mois: string;
  duree_minutes: number;
  moyenne_duree_minutes: number;
}
