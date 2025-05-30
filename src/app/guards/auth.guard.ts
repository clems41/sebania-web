// guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot

  ): boolean {
    // Vérifie si l'utilisateur est connecté
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Si l'utilisateur n'est pas connecté, stocke l'URL tentée
    // pour y retourner après la connexion
    this.authService.redirectUrl = state.url;

    // Redirige vers la page de connexion
    this.router.navigate(['/connexion'], {
      queryParams: { returnUrl: state.url }
    });

    return false;

  }
}
