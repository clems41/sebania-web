import {MethodeAgricole} from './methode-agricole';
import {User} from './user';

export interface Ferme {
  id: number;
  nom: string;
  adresse: string;
  superficie_cultivee: string;
  responsable: User;
  methodes_agricoles: MethodeAgricole[];
  employes: User[];
  code_postal: string;
}
