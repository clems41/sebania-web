export interface RepartitionActivite {
  data: RepartitionActiviteItem[];
}

export interface RepartitionActiviteItem {
  categorie_nom: string;
  duree_minutes: number;
}

export interface RepartitionCulture {
  data: RepartitionCultureItem[];
}

export interface RepartitionCultureItem {
  culture_nom: string;
  duree_minutes: number;
}

export interface RepartitionParcelle {
  data: RepartitionParcelleItem[];
}

export interface RepartitionParcelleItem {
  parcelle_nom: string;
  duree_minutes: number;
}

export interface EvolutionTempsTravail {
  data: EvolutionTempsTravailItem[];
}

export interface EvolutionTempsTravailItem {
  mois: string;
  duree_minutes: number;
  moyenne_duree_minutes: number;
}
