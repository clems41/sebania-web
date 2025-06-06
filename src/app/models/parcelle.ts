export interface Parcelle {
  id: number;
  nom: string;
  longueur: number;
  largeur: number;
  largeur_planche: number;
  nombre_planches: number;
  type: TypeParcelle;
  largeur_passe_pieds: number;
  superficie: number;
  superficie_cultivee: number;
}

export interface TypeParcelle {
  id: number;
  nom: string;
}
