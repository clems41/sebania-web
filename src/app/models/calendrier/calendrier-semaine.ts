import {StatutJour} from '../statut-jour';

export interface Calendrier {
  jours: CalendrierJour[];
  total_minutes: number;
}

export interface CalendrierJour {
  jour: Date;
  total_jour_minutes: number;
  nb_taches_with_missing_fields: number;
  statut: StatutJour;
}
