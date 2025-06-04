export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  ferme: FermeRegisterRequest;
}

export interface FermeRegisterRequest {
  nom: string;
  superficie_cultivee: number;
  methodes_agricoles: number[];
  employes: EmployeRegisterRequest[];
  code_postal: string;
}

export interface EmployeRegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
}
