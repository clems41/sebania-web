// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NoAuthGuard } from './guards/no-auth.guard';

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
            redirectTo: 'general',
            pathMatch: 'full'
          },
          {
            path: 'general',
            loadComponent: () => import('./pages/tableau-bord/general/general.component')
              .then(m => m.GeneralComponent),
            title: 'Tableau de bord général'
          },
          {
            path: 'legume',
            loadComponent: () => import('./pages/tableau-bord/legume/legume.component')
              .then(m => m.LegumeComponent),
            title: 'Tableau de bord légumes'
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
        path: 'profil',
        loadComponent: () => import('./pages/profil/profil.component')
          .then(m => m.ProfilComponent),
        title: 'Profil'
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
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'auth',
        children: [
          {
            path: 'connexion',
            loadComponent: () => import('./pages/connexion/connexion.component')
              .then(m => m.ConnexionComponent),
            title: 'Connexion'
          },
          {
            path: 'inscription',
            loadComponent: () => import('./pages/inscription/inscription.component')
              .then(m => m.InscriptionComponent),
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
