import { Injectable } from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot

  ): Observable<boolean> {
    return this.authService.isLoggedIn();
  }

}
