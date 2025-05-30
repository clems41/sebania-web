import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-top-bar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }

  navigateToSettings() {
    this.router.navigate(['/parametres']);
  }

  navigateToProfile() {
    this.router.navigate(['/profil']);
  }
}

