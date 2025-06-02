import { Injectable } from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot

  ): Observable<boolean> {
    if (!this.authService.isLoggedIn()) {
      this.redirectToLogin(state.url);
      return of(false);
    }
    return of(true);
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/connexion'], {
      queryParams: { returnUrl }
    });
  }

}
