import {User} from '../user';

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  ferme: FermeRegisterRequest;
}

export interface FermeRegisterRequest {
  nom: string;
  adresse: string;
  superficie_cultivee: string;
  methodes_agricoles: number[];
  employes: User[];
  code_postal: string;
}
