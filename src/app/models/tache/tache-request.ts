export interface TacheRequest {
  date: Date;
  activite_id: number;
  user_id: number;
  duree_minutes: number;
  commentaire: string;
  parcelle_ids: number[];
  quantite: number;
  unite_id: number;
  cultures: CultureTacheRequest[];
}

export interface PatchTacheRequest {
  date?: Date;
  activite_id?: number;
  user_id?: number;
  duree_minutes?: number;
  commentaire?: string;
  parcelle_ids?: number[];
  quantite?: number;
  unite_id?: number;
  cultures?: CultureTacheRequest[];
}

export interface CultureTacheRequest {
  culture_id: number;
  parcelle_ids: number[];
  quantite: number;
  unite_id: number;
}
