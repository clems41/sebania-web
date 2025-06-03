import {MethodeAgricole} from './methode-agricole';
import {User} from './user';

export interface Ferme {
  nom: string;
  addresse: string;
  superficie_cultivee: string;
  methodes_agricoles: MethodeAgricole[];
  employes: User[];
  code_postal: string;
}
