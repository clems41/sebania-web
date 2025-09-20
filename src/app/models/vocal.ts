export interface Vocal {
  id: number;
  statut: string;
  created_at: Date;
  transcribed_at: Date;
  finished_at: Date;
  analyzed_at: Date;
  date: Date;
  origine: string;
}

export enum VocalType {
  Taches,
  Parcelles
}
