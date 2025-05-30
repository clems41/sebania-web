// services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = true; // À des fins de démonstration
  public redirectUrl: string = '';

  constructor(private router: Router) {}

  logout() {
    this.isAuthenticated = false;
    this.router.navigate(['/connexion']);
    console.log("decconexion")
  }

  login(email: string, password: string) {
    this.isAuthenticated = true;
    this.router.navigate(['']);
    console.log("connexion")
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
