import {Activite} from './activite';
import {User} from './user';
import {Culture} from './culture';
import {Parcelle} from './parcelle';
import {Unite} from './unite';

export interface Tache {
  id: number;
  activite: Activite;
  date: Date;
  user: User;
  duree_minutes: number;
  cultures: CultureTache[];
  parcelles: Parcelle[];
  quantite: number;
  nature: string;
  unite: Unite;
  commentaire: string;
  fields_are_missing: boolean;
  vocal_id: number;
}

export interface CultureTache {
  culture: Culture;
  parcelles: Parcelle[];
  quantite: number;
  nature: string;
  unite: Unite;
  fields_are_missing: boolean;
}
