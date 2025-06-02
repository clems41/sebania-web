// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {NoAuthGuard} from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Routes pour les activités
      {
        path: 'accueil',
        loadComponent: () => import('./pages/activites/accueil/accueil.component')
          .then(m => m.AccueilComponent)
      },
      {
        path: 'calendrier',
        loadComponent: () => import('./pages/activites/calendrier/calendrier.component')
          .then(m => m.CalendrierComponent)
      },
      {
        path: 'activite',
        loadComponent: () => import('./pages/activites/activite/activite.component')
          .then(m => m.ActiviteComponent)
      },

      // Routes pour le tableau de bord
      {
        path: 'general',
        loadComponent: () => import('./pages/tableau-bord/general/general.component')
          .then(m => m.GeneralComponent)
      },
      {
        path: 'legume',
        loadComponent: () => import('./pages/tableau-bord/legume/legume.component')
          .then(m => m.LegumeComponent),
        canActivate: [AuthGuard]
      },

      // Routes pour les paramètres et le profil
      {
        path: 'parametres',
        loadComponent: () => import('./pages/parametres/parametres.component')
          .then(m => m.ParametresComponent)
      },
      {
        path: 'profil',
        loadComponent: () => import('./pages/profil/profil.component')
          .then(m => m.ProfilComponent)
      },
      {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [NoAuthGuard],
    children: [
      // Routes pour l'authentification
      {
        path: 'connexion',
        loadComponent: () => import('./pages/connexion/connexion.component')
          .then(m => m.ConnexionComponent),
      },
      {
        path: 'inscription',
        loadComponent: () => import('./pages/inscription/inscription.component')
          .then(m => m.InscriptionComponent),
      },
    ]
  },
  // Route 404
  {
    path: '**',
    redirectTo: 'accueil',
    pathMatch: 'full'
  }
];
