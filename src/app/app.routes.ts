import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Routes pour les activités
      {
        path: 'activites',
        children: [
          {
            path: '',
            redirectTo: 'accueil',
            pathMatch: 'full'
          },
          {
            path: 'accueil',
            loadComponent: () => import('./pages/activites/accueil/accueil.component')
              .then(m => m.AccueilComponent),
            title: 'Accueil'
          },
          {
            path: 'calendrier',
            loadComponent: () => import('./pages/activites/calendrier/calendrier.component')
              .then(m => m.CalendrierComponent),
            title: 'Calendrier'
          },
          {
            path: 'saisie',
            loadComponent: () => import('./pages/activites/saisie/saisie.component')
              .then(m => m.SaisieComponent),
            title: 'Saisir une activité'
          }
        ]
      },

      // Routes pour le tableau de bord
      {
        path: 'tableau-bord',
        children: [
          {
            path: '',
            redirectTo: 'vue-ensemble',
            pathMatch: 'full'
          },
          {
            path: 'vue-ensemble',
            loadComponent: () => import('./pages/tableau-bord/vue-ensemble/vue-ensemble.component')
              .then(m => m.VueEnsembleComponent),
            title: "Vue d'ensemble"
          },
          {
            path: 'cultures',
            loadComponent: () => import('./pages/tableau-bord/culture/culture.component')
              .then(m => m.CultureComponent),
            title: 'Cultures'
          },
          {
            path: 'parcelles',
            loadComponent: () => import('./pages/tableau-bord/parcelle/parcelle.component')
              .then(m => m.ParcelleComponent),
            title: 'Parcelles'
          },
          {
            path: 'temps-travail',
            loadComponent: () => import('./pages/tableau-bord/temps-travail/temps-travail.component')
              .then(m => m.TempsTravailComponent),
            title: 'Temps de travail'
          },
          {
            path: 'comparaison',
            loadComponent: () => import('./pages/tableau-bord/comparaison/comparaison.component')
              .then(m => m.ComparaisonComponent),
            title: 'Comparaison'
          }
        ]
      },

      // Routes pour les paramètres et le profil
      {
        path: 'parametres',
        loadComponent: () => import('./pages/parametres/parametres.component')
          .then(m => m.ParametresComponent),
        title: 'Paramètres'
      },
      {
        path: '',
        redirectTo: 'activites/accueil',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        children: [
          {
            path: 'connexion',
            loadComponent: () => import('./pages/authentification/connexion/connexion.component')
              .then(m => m.ConnexionComponent),
            title: 'Connexion'
          },
          {
            path: 'inscription',
            loadComponent: () => import('./pages/authentification/inscription/inscription.component')
              .then(m => m.InscriptionComponent),
            title: 'Inscription'
          },
          {
            path: 'mot-de-passe-oublie',
            loadComponent: () => import('./pages/authentification/mot-de-passe-oublie/mot-de-passe-oublie.component')
              .then(m => m.MotDePasseOublieComponent),
            title: 'Inscription'
          },
          {
            path: '',
            redirectTo: 'connexion',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'activites/accueil',
    pathMatch: 'full'
  }
];
