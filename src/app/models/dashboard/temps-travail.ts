import {Activite} from '../activite';
import {Culture} from '../culture';
import {Parcelle} from '../parcelle';

export interface TempsTravailCards {
  duree_minutes: number;
  moyenne_duree_minutes: number;
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
  date: string;
  duree_minutes: number;
  moyenne_duree_minutes: number;
}
