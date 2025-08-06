import {Activite} from '../activite';
import {Culture} from '../culture';
import {Parcelle} from '../parcelle';

export interface TempsTravailCards {
  temps_total_minutes: number;
  temps_total_moyenne_minutes: number;
  activite_chronophage: Activite;
  activite_frequente: Activite;
  culture_chronophage: Culture;
  culture_frequente: Culture;
  parcelle_chronophage: Parcelle;
  parcelle_frequente: Parcelle;
}

export interface TempsTravailEvolution {
  data: TempsTravailEvolutionItem[]
}

export interface TempsTravailEvolutionItem {
  date: Date;
  total_minutes: number;
  total_minutes_moyenne: number;
}
