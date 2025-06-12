import {NiveauComplexite} from './niveau-complexite';
import {Unite} from './unite';

export interface Activite {
  id: number;
  nom: string;
  categorie: string;
  mots_cles: string;
  niveau_complexite: NiveauComplexite;
  unites: Unite[];
}
